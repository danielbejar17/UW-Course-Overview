import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './models.js';
import courseRoutes from './routes/courses.js';
import reviewRoutes from './routes/review.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/courses', courseRoutes);
app.use('/api', reviewRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB before the server starts accepting requests.
// bin/www.cjs awaits this module, so the connection is established
// before http.createServer() begins listening.
await connectDB();

export default app;
