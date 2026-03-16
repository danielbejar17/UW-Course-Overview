import express from 'express';
import {Thread, Comment } from '../models.js';

const router = express.Router();

// Endpoints -
// GET api/courses/:id/threads
// return all threads for a course sorted by date, newest first
router.get('/courses/:id/threads', async (req, res) => {
  try {
    const threads = await Thread.find({ courseID: req.params.id }).sort({ createdAt: -1 });
    const result = [];
    for (const t of threads) {
      const count = await Comment.countDocuments({ threadID: t._id.toString() });
      result.push({ ...t.toObject(), commentCount: count });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// POST /api/courses/:id/threads
// Create a new thread
router.post('/courses/:id/threads', async (req, res) => {
  try {
    const { title, body, username } = req.body;
    const thread = await Thread.create({
      courseID:  req.params.id,
      title,
      body,
      createdBy: username || 'Anonymous',
    });
    res.status(201).json(thread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// GET /api/threads/:id/comments
// Return all comments for a given thread
router.get('/threads/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ threadID: req.params.id }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/threads/:id/comments
// Creat a reply beneath an existing thread
router.post('/threads/:id/comments', async (req, res) => {
  try {
    const { content, username, parentCommentID } = req.body;
    const comment = await Comment.create({
      threadID:        req.params.id,
      userID:          username || 'Anonymous',
      content,
      parentCommentID: parentCommentID || null,
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

export default router;