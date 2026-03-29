import express from 'express';
import Portfolio from '../models/Portfolio.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public: Get portfolio by username
router.get('/:username', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      username: req.params.username.toLowerCase(),
      isPublished: true
    }).populate('owner', 'status');

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    // Only show if owner is approved
    if (portfolio.owner?.status !== 'approved') {
      return res.status(403).json({ message: 'This portfolio is not publicly available yet' });
    }

    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth: Get my portfolio
router.get('/', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ owner: req.user });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth: Create portfolio
router.post('/', authMiddleware, async (req, res) => {
  try {
    const existing = await Portfolio.findOne({ owner: req.user });
    if (existing) return res.status(400).json({ message: 'Portfolio already exists. Use PUT to update.' });

    const portfolio = new Portfolio({ ...req.body, owner: req.user });
    const saved = await portfolio.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username already taken. Please choose another.' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Auth: Update portfolio (owner only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    if (portfolio.owner.toString() !== req.user && req.userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth: Delete portfolio (owner or superadmin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    if (portfolio.owner.toString() !== req.user && req.userRole !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
