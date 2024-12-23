import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';

const BookReviewApp = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      setReviews(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const deleteReview = async (id) => {
    try {
      const response = await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete review');
      await fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setNewReview({ bookTitle: '', author: '', rating: 5, reviewText: '' });
    setEditingId(null);
  };

  const startEditing = (review) => {
    setEditingId(review._id);
    setNewReview({
      bookTitle: review.bookTitle,
      author: review.author,
      rating: review.rating,
      reviewText: review.reviewText
    });
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Book Reviews</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Simple Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded">
        <input
          type="text"
          placeholder="Book Title"
          value={newReview.bookTitle}
          onChange={e => setNewReview({...newReview, bookTitle: e.target.value})}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={newReview.author}
          onChange={e => setNewReview({...newReview, author: e.target.value})}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <div className="flex items-center mb-2">
          <span className="mr-2">Rating:</span>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setNewReview({...newReview, rating: star})}
              className="hover:scale-110 transition-transform"
            >
              <Star
                className={star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                size={20}
              />
            </button>
          ))}
        </div>
        <textarea
          placeholder="Write your review..."
          value={newReview.reviewText}
          onChange={e => setNewReview({...newReview, reviewText: e.target.value})}
          className="w-full mb-2 p-2 border rounded min-h-24"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? 'Update Review' : 'Add Review'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review._id} className="border rounded p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold">{review.bookTitle}</h3>
                <p className="text-sm text-gray-600">by {review.author}</p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    size={16}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700 mb-2">{review.reviewText}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                {new Date(review.dateAdded).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(review)}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => deleteReview(review._id)}
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
  );
};

export default BookReviewApp;