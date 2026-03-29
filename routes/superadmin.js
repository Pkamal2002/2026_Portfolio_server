import express from 'express';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import Contact from '../models/Contact.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();
const superAdminOnly = [authMiddleware, roleMiddleware('superadmin')];

// Get all users
router.get('/users', ...superAdminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve or reject a user
router.put('/users/:id/status', ...superAdminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all portfolios
router.get('/portfolios', ...superAdminOnly, async (req, res) => {
  try {
    const portfolios = await Portfolio.find().populate('owner', 'name email username status').sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Platform stats
router.get('/stats', ...superAdminOnly, async (req, res) => {
  try {
    const [totalUsers, approvedUsers, pendingUsers, rejectedUsers, totalPortfolios, totalMessages] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', status: 'approved' }),
      User.countDocuments({ role: 'user', status: 'pending' }),
      User.countDocuments({ role: 'user', status: 'rejected' }),
      Portfolio.countDocuments(),
      Contact.countDocuments().catch(() => 0),
    ]);
    res.json({ totalUsers, approvedUsers, pendingUsers, rejectedUsers, totalPortfolios, totalMessages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
