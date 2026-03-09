import mongoose from 'mongoose';

// ── Schemas ───────────────────────────────────────────────────────────────────

const courseSchema = new mongoose.Schema({
  department:   String,
  courseNumber: String,
  title:        String,
  description:  String,
  credits:      Number,
  syllabusLink: String,
});

const userSchema = new mongoose.Schema({
  username:     String,
  email:        String,
  passwordHash: String,
  createdAt:    { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  courseID:         { type: String, required: true },
  userID:           String,
  difficultyRating: { type: Number, min: 1, max: 5 },
  workloadRating:   { type: Number, min: 1, max: 5 },
  overallRating:    { type: Number, min: 1, max: 5 },
  reviewText:       String,
  createdAt:        { type: Date, default: Date.now },
});

const threadSchema = new mongoose.Schema({
  courseID:  String,
  title:     String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  threadID:  String,
  userID:    String,
  content:   String,
  createdAt: { type: Date, default: Date.now },
});

// ── Models ────────────────────────────────────────────────────────────────────

export const Course  = mongoose.model('Course',  courseSchema);
export const User    = mongoose.model('User',    userSchema);
export const Review  = mongoose.model('Review',  reviewSchema);
export const Thread  = mongoose.model('Thread',  threadSchema);
export const Comment = mongoose.model('Comment', commentSchema);

// ── Connection ────────────────────────────────────────────────────────────────

export async function connectDB() {
  const uri = process.env.MONGODB_URI ||
    'mongodb+srv://dbejar17_db_user:cs0D7z8LZROzMwbb@cluster0.zsyoary.mongodb.net/realmadrid?appName=Cluster0';
  console.log('Connecting to MongoDB…');
  await mongoose.connect(uri);
  console.log('MongoDB connected.');
}
