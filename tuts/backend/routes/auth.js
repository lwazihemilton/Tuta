import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, type, phone } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed, type, phone });
    await user.save();

    // Send verification email
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    await sendVerificationEmail(email, token);

    const payload = { user: { id: user.id, type: user.type } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { name: user.name, type: user.type } });
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id, type: user.type } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      res.json({ token, user: { name: user.name, type: user.type, emailVerified: user.emailVerified } });
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.user.id, { emailVerified: true });
    res.json({ msg: "Email verified" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
});

export default router;