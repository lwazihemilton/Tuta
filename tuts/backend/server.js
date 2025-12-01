import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import tutorRoutes from './routes/tutors.js';
import bookingRoutes from './routes/bookings.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({ message: "TUTs Backend Live – Dec 2025" });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.log(err));