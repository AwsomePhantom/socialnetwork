import React, { useState, useEffect } from 'react';
import { booksAPI } from '../../services/api';
import '../../styles/components.css';

const Library = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBooks();
    loadBorrowedBooks();
  }, []);

  const loadBooks = async (search = '') => {
    try {
      setLoading(true);
      const data = await booksAPI.getAll(search);
      setBooks(data || []);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBorrowedBooks = async () => {
    try {
      const data = await booksAPI.getBorrowed();
      setBorrowedBooks(data || []);
    } catch (error) {
      console.error('Failed to load borrowed books:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    loadBooks(query);
  };

  const handleBorrow = async (bookId) => {
    try {
      const result = await booksAPI.borrow(bookId);
      alert(`Book borrowed! Due date: ${result.dueDate}`);
      loadBooks(searchQuery);
      loadBorrowedBooks();
    } catch (error) {
      console.error('Failed to borrow book:', error);
      alert(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleReturn = async (borrowId, bookId) => {
    try {
      await booksAPI.return(borrowId, bookId);
      alert('Book returned successfully!');
      loadBooks(searchQuery);
      loadBorrowedBooks();
    } catch (error) {
      console.error('Failed to return book:', error);
      alert('Failed to return book');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="library-page">
      <h2 className="page-title">
        <i className="fas fa-book-open"></i>
        Library
      </h2>

      {/* Search Bar */}
      <div className="card search-card">
        <div className="search-input-wrapper">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-book"></i>
          <p>No books found</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="card book-card">
              <div className="book-cover">
                <img
                  src={book.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'}
                  alt={book.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400';
                  }}
                />
              </div>
              <div className="book-details">
                <h3>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <div className="book-meta">
                  <span className={`availability ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Unavailable'}
                  </span>
                  {book.category && <span className="category">{book.category}</span>}
                </div>
                <button
                  className={`btn ${book.availableCopies > 0 ? 'btn-primary' : 'btn-secondary'} btn-block`}
                  disabled={book.availableCopies <= 0}
                  onClick={() => handleBorrow(book.id)}
                >
                  <i className="fas fa-hand-holding"></i>
                  Borrow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Borrowed Books Section */}
      <div className="card borrowed-section">
        <h3>
          <i className="fas fa-bookmark"></i>
          My Borrowed Books
        </h3>
        {borrowedBooks.length === 0 ? (
          <p className="no-borrowed">No borrowed books</p>
        ) : (
          <div className="borrowed-list">
            {borrowedBooks.map((book) => (
              <div key={book.id} className="borrowed-item">
                <img
                  src={book.imageUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'}
                  alt={book.title}
                />
                <div className="borrowed-info">
                  <h4>{book.title}</h4>
                  <p>Due: {formatDate(book.dueDate)}</p>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleReturn(book.id, book.bookId)}
                >
                  Return
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
