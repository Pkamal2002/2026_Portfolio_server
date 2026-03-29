import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'admin'
  },
  // For platform users (role='user'), pending approval from superadmin
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
