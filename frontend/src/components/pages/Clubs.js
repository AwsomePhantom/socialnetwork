import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { clubsAPI, getImageUrl } from '../../services/api';
import '../../styles/components.css';

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubPosts, setClubPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [postImagePreview, setPostImagePreview] = useState(null);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [posting, setPosting] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      setLoading(true);
      const data = await clubsAPI.getAll();
      setClubs(data || []);
    } catch (error) {
      console.error('Failed to load clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (clubId) => {
    try {
      await clubsAPI.join(clubId);
      loadClubs();
    } catch (error) {
      console.error('Failed to join club:', error);
    }
  };

  const handleLeave = async (clubId) => {
    try {
      await clubsAPI.leave(clubId);
      loadClubs();
    } catch (error) {
      console.error('Failed to leave club:', error);
    }
  };

  const viewClubFeed = async (club) => {
    setSelectedClub(club);
    setLoadingPosts(true);
    try {
      const data = await clubsAPI.getPosts(club.id);
      setClubPosts(data || []);
    } catch (error) {
      console.error('Failed to load club posts:', error);
      alert('You must be a member to view club posts');
      setSelectedClub(null);
    } finally {
      setLoadingPosts(false);
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

      // Create preview and base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPostImage(base64);
        setPostImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPostImage = () => {
    setPostImage(null);
    setPostImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('clubPostImageInput');
    if (fileInput) fileInput.value = '';
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!postContent.trim() && !postImage) {
      alert('Please add some content or an image');
      return;
    }

    try {
      setPosting(true);
      
      const postData = {
        content: postContent.trim(),
        imageUrl: postImage, // This is already base64
        isAnnouncement,
      };

      console.log('Creating club post with image:', !!postImage);
      
      const result = await clubsAPI.createPost(selectedClub.id, postData);
      
      if (result.success) {
        setPostContent('');
        clearPostImage();
        setIsAnnouncement(false);
        await viewClubFeed(selectedClub);
      } else {
        alert(result.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await clubsAPI.toggleLike(postId);
      viewClubFeed(selectedClub);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const openComments = async (postId) => {
    setShowComments(postId);
    try {
      const data = await clubsAPI.getComments(postId);
      setComments(data || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !showComments) return;

    try {
      await clubsAPI.addComment(showComments, commentText.trim());
      setCommentText('');
      openComments(showComments);
      viewClubFeed(selectedClub);
    } catch (error) {
      console.error('Failed to add comment:', error);
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

  // Club Feed View
  if (selectedClub) {
    return (
      <div className="club-feed-page">
        <div className="club-feed-header">
          <button className="back-btn" onClick={() => setSelectedClub(null)}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="club-info">
            <h2>{selectedClub.name}</h2>
            <p>{selectedClub.membersCount} members</p>
          </div>
          {selectedClub.isAdmin && <span className="admin-badge">Admin</span>}
        </div>

        {/* Create Post Form */}
        <div className="card create-post-card">
          <form onSubmit={handleCreatePost}>
            <div className="create-post-header">
              <div className="avatar-ring">
                <img
                  src={getAvatarUrl(user?.avatar || user?.profile?.avatar, user?.fullName)}
                  alt="Avatar"
                />
              </div>
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share with club members..."
                className="post-input"
                rows="2"
              />
            </div>

            {postImagePreview && (
              <div className="image-preview">
                <img src={postImagePreview} alt="Preview" />
                <button type="button" className="remove-image" onClick={clearPostImage}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}

            <div className="create-post-footer">
              <div className="post-options">
                <label className="image-upload-btn">
                  <i className="fas fa-image"></i>
                  <span>Photo</span>
                  <input 
                    type="file" 
                    id="clubPostImageInput"
                    accept="image/jpeg,image/png,image/gif,image/webp" 
                    onChange={handleImageChange} 
                    hidden 
                  />
                </label>
                {selectedClub.isAdmin && (
                  <label className="announcement-toggle">
                    <input
                      type="checkbox"
                      checked={isAnnouncement}
                      onChange={(e) => setIsAnnouncement(e.target.checked)}
                    />
                    <span>Announcement</span>
                  </label>
                )}
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={posting || (!postContent.trim() && !postImage)}
              >
                {posting ? <span className="loading-spinner-small"></span> : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Club Posts */}
        {loadingPosts ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : clubPosts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-comments"></i>
            <p>No posts in this club yet</p>
          </div>
        ) : (
          <div className="posts-list">
            {clubPosts.map((post) => (
              <div key={post.id} className={`card post-card ${post.isAnnouncement ? 'announcement' : ''}`}>
                {post.isAnnouncement && (
                  <div className="announcement-badge">
                    <i className="fas fa-bullhorn"></i>
                    Announcement
                  </div>
                )}
                <div className="post-header">
                  <div className="avatar-ring">
                    <img
                      src={getAvatarUrl(post.authorAvatar, post.authorName)}
                      alt="Avatar"
                    />
                  </div>
                  <div className="post-info">
                    <h4>
                      {post.authorName}
                      {post.isAdminPost && <span className="role-tag">Admin</span>}
                    </h4>
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
                {comments.length === 0 ? (
                  <p className="no-comments">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <img
                        src={getAvatarUrl(comment.authorAvatar, comment.authorName)}
                        alt="Avatar"
                      />
                      <div className="comment-content">
                        <span className="comment-author">{comment.authorName}</span>
                        <p>{comment.content}</p>
                      </div>
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
  }

  // Clubs List View
  return (
    <div className="clubs-page">
      <h2 className="page-title">
        <i className="fas fa-users"></i>
        Student Clubs
      </h2>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading clubs...</p>
        </div>
      ) : clubs.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-users"></i>
          <p>No clubs available</p>
        </div>
      ) : (
        <div className="clubs-grid">
          {clubs.map((club) => (
            <div key={club.id} className="card club-card">
              <div className="club-cover">
                <img
                  src={club.coverImage || club.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400'}
                  alt={club.name}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400';
                  }}
                />
              </div>
              <div className="club-details">
                <div className="club-header">
                  <div>
                    <h3>{club.name}</h3>
                    <p><i className="fas fa-users"></i> {club.membersCount} members</p>
                  </div>
                  {club.isAdmin && <span className="admin-badge">Admin</span>}
                </div>
                <p className="club-description">{club.description}</p>
                <div className="club-actions">
                  {club.isAdmin ? (
                    <button className="btn btn-secondary" disabled>
                      <i className="fas fa-crown"></i>
                      Owner
                    </button>
                  ) : club.isMember ? (
                    <button className="btn btn-secondary" onClick={() => handleLeave(club.id)}>
                      <i className="fas fa-check"></i>
                      Joined
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => handleJoin(club.id)}>
                      <i className="fas fa-plus"></i>
                      Join
                    </button>
                  )}
                  {(club.isMember || club.isAdmin) && (
                    <button className="btn btn-primary" onClick={() => viewClubFeed(club)}>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clubs;
