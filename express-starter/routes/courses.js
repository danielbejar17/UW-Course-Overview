import express from 'express';

const router = express.Router();

const courses = [
  { _id: '1', department: 'CSE', courseNumber: '142', title: 'Computer Programming I',           credits: 4, description: 'Basic programming concepts using Java.' },
  { _id: '2', department: 'CSE', courseNumber: '143', title: 'Computer Programming II',          credits: 4, description: 'Recursion, linked lists, trees, and advanced OOP.' },
  { _id: '3', department: 'MATH', courseNumber: '126', title: 'Calculus with Analytic Geometry III', credits: 5, description: 'Sequences, series, and multivariable calculus.' },
  { _id: '4', department: 'ENGL', courseNumber: '131', title: 'Composition: Literature',         credits: 5, description: 'Writing skills through reading and analysis of literary texts.' },
  { _id: '5', department: 'STAT', courseNumber: '311', title: 'Elements of Statistical Methods', credits: 4, description: 'Probability, confidence intervals, and hypothesis testing.' },
  { _id: '6', department: 'PHYS', courseNumber: '121', title: 'Mechanics',                       credits: 5, description: 'Kinematics, Newton\'s laws, energy, and momentum.' },
];

// GET /api/courses
router.get('/', (req, res) => {
  res.json(courses);
});

// GET /api/courses/:id
router.get('/:id', (req, res) => {
  const course = courses.find(c => c._id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

export default router;