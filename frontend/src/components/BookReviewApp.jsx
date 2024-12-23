import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2, X, AlertCircle, Mail, Github } from 'lucide-react';

const BookReviewApp = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [validation, setValidation] = useState({});
  const [newReview, setNewReview] = useState({
    bookTitle: '',
    author: '',
    rating: 5,
    reviewText: ''
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchReviews();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (newReview.bookTitle.trim().length < 2) {
      errors.bookTitle = 'Book title must be at least 2 characters';
    }
    if (newReview.author.trim().length < 2) {
      errors.author = 'Author name must be at least 2 characters';
    }
    if (newReview.reviewText.trim().length < 10) {
      errors.reviewText = 'Review must be at least 10 characters';
    }
    setValidation(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editingId 
        ? `${API_URL}/reviews/${editingId}`
        : `${API_URL}/reviews`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'add'} review`);
      
      await fetchReviews();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const deleteReview = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/${deleteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete review');
      await fetchReviews();
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setNewReview({ bookTitle: '', author: '', rating: 5, reviewText: '' });
    setEditingId(null);
    setValidation({});
  };

  const startEditing = (review) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(review._id);
    setNewReview({
      bookTitle: review.bookTitle,
      author: review.author,
      rating: review.rating,
      reviewText: review.reviewText
    });
    setValidation({});
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow w-full">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            📚 Book Reviews
          </h1>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-auto hover:text-red-900"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Book Title"
                value={newReview.bookTitle}
                onChange={e => setNewReview({...newReview, bookTitle: e.target.value})}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                  ${validation.bookTitle ? 'border-red-500' : 'border-gray-200'}`}
              />
              {validation.bookTitle && (
                <p className="text-red-500 text-sm mt-1">{validation.bookTitle}</p>
              )}
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                placeholder="Author"
                value={newReview.author}
                onChange={e => setNewReview({...newReview, author: e.target.value})}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                  ${validation.author ? 'border-red-500' : 'border-gray-200'}`}
              />
              {validation.author && (
                <p className="text-red-500 text-sm mt-1">{validation.author}</p>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-600">Rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      size={24}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <textarea
                placeholder="Write your review..."
                value={newReview.reviewText}
                onChange={e => setNewReview({...newReview, reviewText: e.target.value})}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-32
                  ${validation.reviewText ? 'border-red-500' : 'border-gray-200'}`}
              />
              {validation.reviewText && (
                <p className="text-red-500 text-sm mt-1">{validation.reviewText}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex-1"
              >
                {editingId ? '💾 Update Review' : '✨ Add Review'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Reviews Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map(review => (
              <div key={review._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{review.bookTitle}</h3>
                    <p className="text-gray-600">by {review.author}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        size={18}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>
                <div className="flex justify-between items-center text-sm border-t pt-4">
                  <span className="text-gray-500">
                    {new Date(review.dateAdded).toLocaleDateString()}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditing(review)}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(review._id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Developer:</span>
              <span>Yasas Pasindu Fernando</span>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="mailto:yasaspasindufernando@gmail.com"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
                <span>Email</span>
              </a>
              <a 
                href="https://github.com/YasasPasinduFernando/book-review-app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                aria-label="GitHub Repository"
              >
                <Github size={20} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteReview}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex-1"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReviewApp;