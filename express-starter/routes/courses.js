import express from 'express';
import { Course, Review } from '../models.js';

const router = express.Router();

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();

    const withRatings = await Promise.all(courses.map(async (c) => {
      const reviews = await Review.find({ courseID: c._id.toString() });
      const count = reviews.length;

      const avg = (field) =>
        count ? reviews.reduce((sum, r) => sum + (r[field] || 0), 0) / count : null;

      return {
        ...c.toObject(),
        reviewCount:   count,
        avgOverall:    avg('overallRating'),
        avgDifficulty: avg('difficultyRating'),
        avgWorkload:   avg('workloadRating'),
      };
    }));

    res.json(withRatings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const reviews = await Review.find({ courseID: req.params.id });
    const count = reviews.length;

    const avg = (field) =>
      count ? reviews.reduce((sum, r) => sum + (r[field] || 0), 0) / count : null;

    res.json({
      ...course.toObject(),
      ratings: {
        avgOverall:    avg('overallRating'),
        avgDifficulty: avg('difficultyRating'),
        avgWorkload:   avg('workloadRating'),
        reviewCount:   count,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

export default router;
