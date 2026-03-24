import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  skills: [{ type: String, required: true }]
}, { timestamps: true });

export default mongoose.model('Skill', skillSchema);
