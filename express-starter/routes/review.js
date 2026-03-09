import express from 'express';
import { Review } from '../models.js';

const router = express.Router();

// GET /api/courses/:id/reviews
router.get('/courses/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ courseID: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/courses/:id/reviews
router.post('/courses/:id/reviews', async (req, res) => {
  try {
    const { username, difficultyRating, workloadRating, overallRating, reviewText } = req.body;

    const newReview = await Review.create({
      courseID:         req.params.id,
      userID:           username || 'Anonymous',
      difficultyRating: Number(difficultyRating),
      workloadRating:   Number(workloadRating),
      overallRating:    Number(overallRating),
      reviewText,
    });

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export default router;
