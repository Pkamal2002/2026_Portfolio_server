import express from 'express';
import Experience from '../models/Experience.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public: Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Add new experience
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newExp = new Experience(req.body);
    const saved = await newExp.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update experience
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete experience
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
