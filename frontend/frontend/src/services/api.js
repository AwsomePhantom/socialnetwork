import axios from 'axios';

// API Base URL - Update this to match your NestJS backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// HELPER: Get full image URL
// ============================================
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('data:')) return path;
  // For relative paths like /uploads/image.jpg
  return `${BASE_URL}${path}`;
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  registerClubAdmin: async (data) => {
    const response = await api.post('/auth/register-club-admin', data);
    return response.data;
  },
};

// ============================================
// USERS API
// ============================================
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  search: async (query) => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data;
  },
};

// ============================================
// POSTS API
// ============================================
export const postsAPI = {
  getAll: async () => {
    const response = await api.get('/posts');
    return response.data;
  },
  
  create: async (data) => {
    // Send JSON with base64 image
    const response = await api.post('/posts', {
      content: data.content || '',
      imageUrl: data.imageUrl || null,
    });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
  
  toggleLike: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
  
  getComments: async (id) => {
    const response = await api.get(`/posts/${id}/comments`);
    return response.data;
  },
  
  addComment: async (id, content) => {
    const response = await api.post(`/posts/${id}/comments`, { content });
    return response.data;
  },
  
  deleteComment: async (commentId) => {
    const response = await api.delete(`/posts/comments/${commentId}`);
    return response.data;
  },
};

// ============================================
// CLUBS API
// ============================================
export const clubsAPI = {
  getAll: async () => {
    const response = await api.get('/clubs');
    return response.data;
  },
  
  join: async (id) => {
    const response = await api.post(`/clubs/${id}/join`);
    return response.data;
  },
  
  leave: async (id) => {
    const response = await api.delete(`/clubs/${id}/leave`);
    return response.data;
  },
  
  getPosts: async (id) => {
    const response = await api.get(`/clubs/${id}/posts`);
    return response.data;
  },
  
  createPost: async (id, data) => {
    const response = await api.post(`/clubs/${id}/posts`, {
      content: data.content || '',
      imageUrl: data.imageUrl || null,
      isAnnouncement: data.isAnnouncement || false,
    });
    return response.data;
  },
  
  toggleLike: async (postId) => {
    const response = await api.post(`/clubs/posts/${postId}/like`);
    return response.data;
  },
  
  getComments: async (postId) => {
    const response = await api.get(`/clubs/posts/${postId}/comments`);
    return response.data;
  },
  
  addComment: async (postId, content) => {
    const response = await api.post(`/clubs/posts/${postId}/comments`, { content });
    return response.data;
  },
  
  deleteComment: async (commentId) => {
    const response = await api.delete(`/clubs/comments/${commentId}`);
    return response.data;
  },
};

// ============================================
// BOOKS API
// ============================================
export const booksAPI = {
  getAll: async (search = '') => {
    const response = await api.get(`/books${search ? `?search=${search}` : ''}`);
    return response.data;
  },
  
  getBorrowed: async () => {
    const response = await api.get('/books/borrowed');
    return response.data;
  },
  
  borrow: async (id) => {
    const response = await api.post(`/books/${id}/borrow`);
    return response.data;
  },
  
  return: async (borrowId, bookId) => {
    const response = await api.post(`/books/${borrowId}/return/${bookId}`);
    return response.data;
  },
};

// ============================================
// MESSAGES API
// ============================================
export const messagesAPI = {
  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
  
  createConversation: async (data) => {
    const response = await api.post('/messages/conversations', data);
    return response.data;
  },
  
  getMessages: async (conversationId) => {
    const response = await api.get(`/messages/conversations/${conversationId}`);
    return response.data;
  },
  
  sendMessage: async (data) => {
    const response = await api.post('/messages', {
      conversationId: data.conversationId,
      content: data.content || '',
      imageUrl: data.imageUrl || null,
    });
    return response.data;
  },
  
  getSettings: async (conversationId) => {
    const response = await api.get(`/messages/conversations/${conversationId}/settings`);
    return response.data;
  },
  
  updateSettings: async (conversationId, data) => {
    const response = await api.put(`/messages/conversations/${conversationId}/settings`, data);
    return response.data;
  },
  
  leaveConversation: async (conversationId) => {
    const response = await api.delete(`/messages/conversations/${conversationId}`);
    return response.data;
  },
};

// ============================================
// COURSES API (CGPA)
// ============================================
export const coursesAPI = {
  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/courses', data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
  
  calculateCGPA: async () => {
    const response = await api.get('/courses/cgpa');
    return response.data;
  },
};

// ============================================
// UPLOAD API
// ============================================
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  uploadBase64: async (base64Image, filename) => {
    const response = await api.post('/upload/base64', {
      image: base64Image,
      filename,
    });
    return response.data;
  },
};

// ============================================
// ADMIN API
// ============================================
export const adminAPI = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  // Users
  getUsers: async (role) => {
    const response = await api.get(`/admin/users${role ? `?role=${role}` : ''}`);
    return response.data;
  },
  
  updateUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  
  createClubAdmin: async (data) => {
    const response = await api.post('/admin/users/club-admin', data);
    return response.data;
  },
  
  // Clubs
  getClubs: async () => {
    const response = await api.get('/admin/clubs');
    return response.data;
  },
  
  createClub: async (data) => {
    const response = await api.post('/admin/clubs', data);
    return response.data;
  },
  
  updateClub: async (id, data) => {
    const response = await api.put(`/admin/clubs/${id}`, data);
    return response.data;
  },
  
  deleteClub: async (id) => {
    const response = await api.delete(`/admin/clubs/${id}`);
    return response.data;
  },
  
  getClubAdmins: async () => {
    const response = await api.get('/admin/club-admins');
    return response.data;
  },
  
  // Posts
  getPosts: async () => {
    const response = await api.get('/admin/posts');
    return response.data;
  },
  
  deletePost: async (id) => {
    const response = await api.delete(`/admin/posts/${id}`);
    return response.data;
  },
  
  // Books
  getBooks: async () => {
    const response = await api.get('/admin/books');
    return response.data;
  },
  
  createBook: async (data) => {
    const response = await api.post('/admin/books', data);
    return response.data;
  },
  
  deleteBook: async (id) => {
    const response = await api.delete(`/admin/books/${id}`);
    return response.data;
  },
};

export default api;
