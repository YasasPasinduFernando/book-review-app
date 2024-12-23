const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  bookTitle: { type: String, required: true },
  author: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// API Routes
// Get all reviews
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort('-dateAdded');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a review
app.post('/reviews', async (req, res) => {
  const review = new Review({
    bookTitle: req.body.bookTitle,
    author: req.body.author,
    rating: req.body.rating,
    reviewText: req.body.reviewText
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a review
app.put('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      review.bookTitle = req.body.bookTitle || review.bookTitle;
      review.author = req.body.author || review.author;
      review.rating = req.body.rating || review.rating;
      review.reviewText = req.body.reviewText || review.reviewText;
      
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a review
app.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await review.deleteOne();
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
