import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String },
  image: { type: String },
});

const portfolioSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Basic Info
  name: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  tagline: { type: String },
  // Skills
  skills: [{ type: String }],
  // Projects
  projects: [projectSchema],
  // Social links
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    website: { type: String },
  },
  // Template (1–5)
  template: { type: Number, default: 1, min: 1, max: 5 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Portfolio', portfolioSchema);
