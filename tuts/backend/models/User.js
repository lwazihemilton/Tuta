import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  type: { type: String, enum: ['student', 'tutor'], required: true },
  emailVerified: { type: Boolean, default: false },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);