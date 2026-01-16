import React, { createContext, useReducer, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const PostContext = createContext();

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

/**
 * postReducer - Reducer function for managing post state
 * Handles various post-related actions including fetching, deleting, and updating likes
 * @param {Object} state - Current state object containing posts array, loading status, and errors
 * @param {Object} action - Action object with type and optional payload
 * @returns {Object} Updated state based on action type
 */
const postReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START': return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { ...state, loading: false, posts: action.payload };
    case 'FETCH_ERROR': return { ...state, loading: false, error: action.payload };
    case 'DELETE_POST':
      return { ...state, posts: state.posts.filter(p => p.id !== action.payload) };
    case 'UPDATE_POST_LIKE':
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId
            ? {
              ...post,
              isLiked: action.payload.liked,
              likes: action.payload.liked
                ? Number(post.likes) + 1
                : Number(post.likes) - 1
            }
            : post
        ),
      };
    default: return state;
  }
};

/**
 * PostProvider - Context provider component for managing global post state
 * Wraps the application to provide post-related functionality to all child components
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap with the context provider
 */
export const PostProvider = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(postReducer, initialState);

  const API_URL = 'http://localhost:3000';


  /**
   * fetchPosts - Fetches all posts from the API for the current user's news feed
   * Updates the state with the fetched posts or error message if request fails
   * @async
   * @returns {Promise<void>}
   */
  const fetchPosts = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await fetch(`${API_URL}/posts?userId=${user?.id || 1}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, [user?.id]);

  /**
   * fetchPostById - Fetches a single post by its ID from the API
   * Retrieves detailed information about a specific post for display
   * @async
   * @param {number|string} id - The ID of the post to fetch
   * @returns {Promise<Object|null>} The post object if found, null if error occurs
   */
  const fetchPostById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}?userId=${user?.id || 0}`);
      if (!response.ok) throw new Error('Post not found');
      return await response.json();
    } catch (err) {
      console.error("Fetch detail error:", err);
      return null;
    }
  };

  /**
   * toggleLike - Toggles the like status of a post for the current user
   * Sends a POST request to the API and updates the local state if successful
   * @async
   * @param {number|string} postId - The ID of the post to toggle like status
   * @returns {Promise<void>}
   */
  const toggleLike = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });
      if (response.ok) {
        const { liked } = await response.json();
        dispatch({ type: 'UPDATE_POST_LIKE', payload: { postId, liked } });
      }
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  /**
   * createPost - Creates a new post with the given content
   * Sends the post to the API and updates the posts list if successful
   * @async
   * @param {number|string} userId - The ID of the user creating the post
   * @param {string} content - The text content of the new post
   * @returns {Promise<boolean>} True if post was created successfully, false otherwise
   */
  const createPost = async (userId, content) => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: content }),
      });

      if (response.ok) {
        const newPost = await response.json();

        // Ensure all fields used by the UI are present here
        const fullPost = {
          ...newPost,
          user_id: userId,    // Add this line (must match the UI check)
          user: user.name,
          likes: 0,
          time: new Date().toISOString()
        };

        dispatch({ type: 'FETCH_SUCCESS', payload: [fullPost, ...state.posts] });
        return true;
      }
    } catch (err) {
      return false;
    }
  };

  /**
   * deletePost - Deletes a post by its ID
   * Sends a DELETE request to the API and removes the post from state if successful
   * @async
   * @param {number|string} postId - The ID of the post to delete
   * @returns {Promise<boolean>} True if post was deleted successfully, false otherwise
   */
  const deletePost = async (postId) => {
    if (!user?.id) {
      console.error("Delete failed: No user ID found in context");
      return false;
    }

    try {
      const url = `${API_URL}/posts/${postId}?userId=${user.id}`;
      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        dispatch({ type: 'DELETE_POST', payload: postId });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Network error during delete:", err);
      return false;
    }
  };

  const fetchCommentsByPost = async (postId) => {
  try {
    const response = await fetch(`${API_URL}/comments/post/${postId}`);
    if (!response.ok) throw new Error('Failed to load comments');

    const data = await response.json();

    return data; 
  } catch (err) {
    console.error("fetchCommentsByPost error:", err);
    return [];
  }
};

const addComment = async (postId, userId, content) => {
  try {
    const response = await fetch(`${API_URL}/comments/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, content }),
    });

    if (response.ok) {
      // This returns raw[0] from your service, which has 'content' and 'userName'
      return await response.json();
    }
  } catch (err) {
    console.error("Add comment failed:", err);
    return null;
  }
};

  const deleteComment = async (commentId, userId) => {
    try {
      const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }), 
      });

      return response.ok;
    } catch (err) {
      console.error("Delete comment failed:", err);
      return false;
    }
  };

  return (
    <PostContext.Provider value={{
      ...state, fetchPosts, fetchPostById, toggleLike, createPost, deletePost, addComment, deleteComment, fetchCommentsByPost
    }}>
      {children}
    </PostContext.Provider>
  );
};

/**
 * usePosts - Custom hook to access the posts context
 * Provides access to post state and all post-related functions throughout the app
 * @returns {Object} The posts context value containing state and action functions
 * @throws {Error} If hook is used outside of PostProvider
 */
export const usePosts = () => useContext(PostContext);