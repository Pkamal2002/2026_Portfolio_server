import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import contactRoutes from './routes/contact.js';
import skillRoutes from './routes/skill.js';
import experienceRoutes from './routes/experience.js';
import portfolioRoutes from './routes/portfolio.js';
import superadminRoutes from './routes/superadmin.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Default Route
app.get('/', (req, res) => {
  res.send('Portfolio Platform API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/superadmin', superadminRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
