import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postsAPI, getImageUrl } from '../../services/api';
import '../../styles/components.css';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showComments, setShowComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await postsAPI.getAll();
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    // Reset file input
    const fileInput = document.getElementById('postImageInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !imagePreview) {
      alert('Please add some content or an image');
      return;
    }

    try {
      setPosting(true);
      setError('');
      
      // Send post with base64 image
      const postData = {
        content: content.trim(),
        imageUrl: imagePreview || null, // Send base64 string directly
      };
      
      console.log('Sending post data:', { content: postData.content, hasImage: !!postData.imageUrl });
      
      const result = await postsAPI.create(postData);
      
      console.log('Post result:', result);
      
      if (result.success) {
        setContent('');
        clearImage();
        await loadPosts();
      } else {
        setError(result.error || 'Failed to create post');
        alert(result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      setError('Failed to create post');
      alert('Failed to create post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postsAPI.toggleLike(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const openComments = async (postId) => {
    setShowComments(postId);
    setLoadingComments(true);
    try {
      const data = await postsAPI.getComments(postId);
      setComments(data || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !showComments) return;

    try {
      await postsAPI.addComment(showComments, commentText.trim());
      setCommentText('');
      openComments(showComments);
      loadPosts();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await postsAPI.deleteComment(commentId);
      openComments(showComments);
      loadPosts();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleShare = (postId) => {
    const url = `${window.location.origin}/post/${postId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on StudentHub',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getAvatarUrl = (avatar, name) => {
    if (avatar && !avatar.startsWith('http') && !avatar.startsWith('data:')) {
      return getImageUrl(avatar);
    }
    return avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'user'}`;
  };

  const getPostImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    return getImageUrl(imageUrl);
  };

  return (
    <div className="feed-page">
      {/* Create Post Card */}
      <div className="card create-post-card">
        <form onSubmit={handleSubmit}>
          <div className="create-post-header">
            <div className="avatar-ring">
              <img
                src={getAvatarUrl(user?.avatar || user?.profile?.avatar, user?.fullName)}
                alt="Avatar"
              />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="post-input"
              rows="3"
            />
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="remove-image"
                onClick={clearImage}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {error && (
            <div className="error-message" style={{ margin: '10px 0' }}>
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <div className="create-post-footer">
            <label className="image-upload-btn">
              <i className="fas fa-image"></i>
              <span>Photo</span>
              <input
                id="postImageInput"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                hidden
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={posting || (!content.trim() && !imagePreview)}
            >
              {posting ? (
                <span className="loading-spinner-small"></span>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-newspaper"></i>
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post.id} className="card post-card">
              <div className="post-header">
                <div className="avatar-ring">
                  <img
                    src={getAvatarUrl(post.authorAvatar, post.authorName)}
                    alt="Avatar"
                  />
                </div>
                <div className="post-info">
                  <h4>{post.authorName || 'Anonymous'}</h4>
                  <p>{formatTime(post.createdAt)}</p>
                </div>
              </div>

              <div className="post-content">
                {post.content && <p>{post.content}</p>}
                {post.imageUrl && (
                  <img
                    src={getPostImageUrl(post.imageUrl)}
                    alt="Post"
                    className="post-image"
                    onError={(e) => {
                      console.error('Image failed to load:', post.imageUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div className="post-actions">
                <button onClick={() => handleLike(post.id)}>
                  <i className="fas fa-heart"></i>
                  <span>{post.likesCount || 0}</span>
                </button>
                <button onClick={() => openComments(post.id)}>
                  <i className="fas fa-comment"></i>
                  <span>{post.commentsCount || 0}</span>
                </button>
                <button onClick={() => handleShare(post.id)}>
                  <i className="fas fa-share"></i>
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments Modal */}
      {showComments && (
        <div className="modal-overlay" onClick={() => setShowComments(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Comments</h3>
              <button onClick={() => setShowComments(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="comments-list">
              {loadingComments ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                </div>
              ) : comments.length === 0 ? (
                <p className="no-comments">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <img
                      src={getAvatarUrl(comment.authorAvatar, comment.authorName)}
                      alt="Avatar"
                    />
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.authorName}</span>
                        <span className="comment-time">{formatTime(comment.createdAt)}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                    {comment.userId === user?.id && (
                      <button
                        className="delete-comment"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="comment-input-area">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button onClick={handleAddComment}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
