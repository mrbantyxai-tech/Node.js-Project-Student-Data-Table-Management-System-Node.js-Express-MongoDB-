import 'dotenv/config';
import express from 'express';
import connectDB from './config/db.js';
import studentRoutes from './routes/studentRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

app.get('/', (req, res) => res.status(200).json({
  success: true,
  name: 'CampusConnect Student API',
  message: 'API is running. Use /api/students to manage student records.',
  endpoints: { students: '/api/students', stats: '/api/students/stats' }
}));
app.use('/api/students', studentRoutes);
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Create a .env file using .env.example.');
    process.exit(1);
  }
  await connectDB();
  app.listen(PORT, () => console.log(`CampusConnect API ready at http://localhost:${PORT}`));
}
startServer();
