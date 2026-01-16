import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({ users: 0, clubs: 0, posts: 0, books: 0 });
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [books, setBooks] = useState([]);
  const [clubAdmins, setClubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showCreateClubAdmin, setShowCreateClubAdmin] = useState(false);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showCreateBook, setShowCreateBook] = useState(false);
  
  // Form states
  const [clubAdminForm, setClubAdminForm] = useState({
    studentId: '', fullName: '', email: '', password: '', major: ''
  });
  const [clubForm, setClubForm] = useState({
    name: '', description: '', adminId: ''
  });
  const [bookForm, setBookForm] = useState({
    title: '', author: '', isbn: '', totalCopies: 1, category: '', imageUrl: ''
  });

  useEffect(() => {
    loadStats();
    loadClubAdmins();
  }, []);

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadClubAdmins = async () => {
    try {
      const data = await adminAPI.getClubAdmins();
      setClubAdmins(data || []);
    } catch (error) {
      console.error('Failed to load club admins:', error);
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const usersData = await adminAPI.getUsers();
          setUsers(usersData || []);
          break;
        case 'posts':
          const postsData = await adminAPI.getPosts();
          setPosts(postsData || []);
          break;
        case 'clubs':
          const clubsData = await adminAPI.getClubs();
          setClubs(clubsData || []);
          break;
        case 'books':
          const booksData = await adminAPI.getBooks();
          setBooks(booksData || []);
          break;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // User functions
  const toggleUserStatus = async (userId, isActive) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !isActive });
      loadTabData();
      loadStats();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      loadTabData();
      loadStats();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const createClubAdmin = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createClubAdmin(clubAdminForm);
      setShowCreateClubAdmin(false);
      setClubAdminForm({ studentId: '', fullName: '', email: '', password: '', major: '' });
      loadTabData();
      loadStats();
      loadClubAdmins();
      alert('Club Admin created successfully!');
    } catch (error) {
      console.error('Failed to create club admin:', error);
      alert('Failed to create club admin');
    }
  };

  // Post functions
  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await adminAPI.deletePost(postId);
      loadTabData();
      loadStats();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  // Club functions
  const createClub = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createClub(clubForm);
      setShowCreateClub(false);
      setClubForm({ name: '', description: '', adminId: '' });
      loadTabData();
      loadStats();
      alert('Club created successfully!');
    } catch (error) {
      console.error('Failed to create club:', error);
      alert('Failed to create club');
    }
  };

  const toggleClubStatus = async (clubId, isActive) => {
    try {
      await adminAPI.updateClub(clubId, { isActive: !isActive });
      loadTabData();
    } catch (error) {
      console.error('Failed to update club:', error);
    }
  };

  const deleteClub = async (clubId) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      await adminAPI.deleteClub(clubId);
      loadTabData();
      loadStats();
    } catch (error) {
      console.error('Failed to delete club:', error);
    }
  };

  // Book functions
  const createBook = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createBook(bookForm);
      setShowCreateBook(false);
      setBookForm({ title: '', author: '', isbn: '', totalCopies: 1, category: '', imageUrl: '' });
      loadTabData();
      loadStats();
      alert('Book added successfully!');
    } catch (error) {
      console.error('Failed to create book:', error);
      alert('Failed to add book');
    }
  };

  const deleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await adminAPI.deleteBook(bookId);
      loadTabData();
      loadStats();
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <i className="fas fa-shield-alt"></i>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1><i className="fas fa-shield-alt"></i> Admin Dashboard</h1>
        <span className="admin-badge">System Admin</span>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon"><i className="fas fa-users"></i></div>
          <div className="stat-info">
            <h3>{stats.users || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card clubs">
          <div className="stat-icon"><i className="fas fa-layer-group"></i></div>
          <div className="stat-info">
            <h3>{stats.clubs || 0}</h3>
            <p>Clubs</p>
          </div>
        </div>
        <div className="stat-card posts">
          <div className="stat-icon"><i className="fas fa-newspaper"></i></div>
          <div className="stat-info">
            <h3>{stats.posts || 0}</h3>
            <p>Posts</p>
          </div>
        </div>
        <div className="stat-card books">
          <div className="stat-icon"><i className="fas fa-book"></i></div>
          <div className="stat-info">
            <h3>{stats.books || 0}</h3>
            <p>Books</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i> Users
        </button>
        <button 
          className={activeTab === 'posts' ? 'active' : ''} 
          onClick={() => setActiveTab('posts')}
        >
          <i className="fas fa-newspaper"></i> Posts
        </button>
        <button 
          className={activeTab === 'clubs' ? 'active' : ''} 
          onClick={() => setActiveTab('clubs')}
        >
          <i className="fas fa-layer-group"></i> Clubs
        </button>
        <button 
          className={activeTab === 'books' ? 'active' : ''} 
          onClick={() => setActiveTab('books')}
        >
          <i className="fas fa-book"></i> Books
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Manage Users</h2>
                  <button className="btn btn-primary" onClick={() => setShowCreateClubAdmin(true)}>
                    <i className="fas fa-plus"></i> Add Club Admin
                  </button>
                </div>
                <div className="data-table">
                  {users.length === 0 ? (
                    <p className="no-data">No users found</p>
                  ) : (
                    users.map(u => (
                      <div key={u.id} className="table-row">
                        <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`} alt="" className="row-avatar" />
                        <div className="row-info">
                          <h4>{u.fullName}</h4>
                          <p>{u.email}</p>
                        </div>
                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                        <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div className="row-actions">
                          <button 
                            className={`btn btn-sm ${u.isActive ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => toggleUserStatus(u.id, u.isActive)}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Manage Posts</h2>
                </div>
                <div className="data-table">
                  {posts.length === 0 ? (
                    <p className="no-data">No posts found</p>
                  ) : (
                    posts.map(post => (
                      <div key={post.id} className="table-row">
                        <img src={post.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`} alt="" className="row-avatar" />
                        <div className="row-info">
                          <h4>{post.authorName}</h4>
                          <p className="post-content-preview">{post.content?.substring(0, 100)}...</p>
                        </div>
                        <span className="post-stats">
                          <i className="fas fa-heart"></i> {post.likesCount || 0}
                          <i className="fas fa-comment"></i> {post.commentsCount || 0}
                        </span>
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                        <div className="row-actions">
                          <button className="btn btn-sm btn-danger" onClick={() => deletePost(post.id)}>
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Clubs Tab */}
            {activeTab === 'clubs' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Manage Clubs</h2>
                  <button className="btn btn-primary" onClick={() => setShowCreateClub(true)}>
                    <i className="fas fa-plus"></i> Create Club
                  </button>
                </div>
                <div className="data-table">
                  {clubs.length === 0 ? (
                    <p className="no-data">No clubs found</p>
                  ) : (
                    clubs.map(club => (
                      <div key={club.id} className="table-row">
                        <img src={club.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100'} alt="" className="row-avatar square" />
                        <div className="row-info">
                          <h4>{club.name}</h4>
                          <p>Admin: {club.adminName} • {club.membersCount || 0} members</p>
                        </div>
                        <span className={`status-badge ${club.isActive ? 'active' : 'inactive'}`}>
                          {club.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <div className="row-actions">
                          <button 
                            className={`btn btn-sm ${club.isActive ? 'btn-warning' : 'btn-success'}`}
                            onClick={() => toggleClubStatus(club.id, club.isActive)}
                          >
                            {club.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteClub(club.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Books Tab */}
            {activeTab === 'books' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Manage Books</h2>
                  <button className="btn btn-primary" onClick={() => setShowCreateBook(true)}>
                    <i className="fas fa-plus"></i> Add Book
                  </button>
                </div>
                <div className="data-table">
                  {books.length === 0 ? (
                    <p className="no-data">No books found</p>
                  ) : (
                    books.map(book => (
                      <div key={book.id} className="table-row">
                        <img src={book.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100'} alt="" className="row-avatar book" />
                        <div className="row-info">
                          <h4>{book.title}</h4>
                          <p>by {book.author}</p>
                        </div>
                        <span className="book-copies">
                          {book.availableCopies}/{book.totalCopies} available
                        </span>
                        <span className="book-category">{book.category || 'General'}</span>
                        <div className="row-actions">
                          <button className="btn btn-sm btn-danger" onClick={() => deleteBook(book.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Club Admin Modal */}
      {showCreateClubAdmin && (
        <div className="modal-overlay" onClick={() => setShowCreateClubAdmin(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-user-plus"></i> Create Club Admin</h3>
              <button onClick={() => setShowCreateClubAdmin(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={createClubAdmin}>
              <div className="form-group">
                <label>Admin ID</label>
                <input
                  type="text"
                  value={clubAdminForm.studentId}
                  onChange={e => setClubAdminForm({...clubAdminForm, studentId: e.target.value})}
                  placeholder="ADM001"
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={clubAdminForm.fullName}
                  onChange={e => setClubAdminForm({...clubAdminForm, fullName: e.target.value})}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={clubAdminForm.email}
                  onChange={e => setClubAdminForm({...clubAdminForm, email: e.target.value})}
                  placeholder="admin@university.edu"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={clubAdminForm.password}
                  onChange={e => setClubAdminForm({...clubAdminForm, password: e.target.value})}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={clubAdminForm.major}
                  onChange={e => setClubAdminForm({...clubAdminForm, major: e.target.value})}
                  placeholder="Engineering"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fas fa-plus"></i> Create Club Admin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Club Modal */}
      {showCreateClub && (
        <div className="modal-overlay" onClick={() => setShowCreateClub(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-layer-group"></i> Create Club</h3>
              <button onClick={() => setShowCreateClub(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={createClub}>
              <div className="form-group">
                <label>Club Name</label>
                <input
                  type="text"
                  value={clubForm.name}
                  onChange={e => setClubForm({...clubForm, name: e.target.value})}
                  placeholder="Programming Club"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={clubForm.description}
                  onChange={e => setClubForm({...clubForm, description: e.target.value})}
                  placeholder="Club description..."
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Assign Admin</label>
                <select
                  value={clubForm.adminId}
                  onChange={e => setClubForm({...clubForm, adminId: e.target.value})}
                  required
                >
                  <option value="">Select Club Admin</option>
                  {clubAdmins.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.fullName} ({admin.email})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fas fa-plus"></i> Create Club
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Book Modal */}
      {showCreateBook && (
        <div className="modal-overlay" onClick={() => setShowCreateBook(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-book"></i> Add Book</h3>
              <button onClick={() => setShowCreateBook(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={createBook}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={bookForm.title}
                  onChange={e => setBookForm({...bookForm, title: e.target.value})}
                  placeholder="Book Title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={bookForm.author}
                  onChange={e => setBookForm({...bookForm, author: e.target.value})}
                  placeholder="Author Name"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ISBN</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={e => setBookForm({...bookForm, isbn: e.target.value})}
                    placeholder="ISBN"
                  />
                </div>
                <div className="form-group">
                  <label>Copies</label>
                  <input
                    type="number"
                    value={bookForm.totalCopies}
                    onChange={e => setBookForm({...bookForm, totalCopies: parseInt(e.target.value)})}
                    min={1}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={bookForm.category}
                  onChange={e => setBookForm({...bookForm, category: e.target.value})}
                  placeholder="e.g. Programming, Science"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={bookForm.imageUrl}
                  onChange={e => setBookForm({...bookForm, imageUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fas fa-plus"></i> Add Book
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
