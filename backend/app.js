import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
import agentRoutes from './routes/agent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27018/toolforge";
if (!process.env.MONGODB_URI) {
  console.warn('⚠️ MONGODB_URI not set, using default local fallback.');
}

// CORS — allow Vercel frontend
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (origin.includes('localhost')) return callback(null, true);
    console.warn('CORS blocked:', origin);
    callback(new Error('CORS: origin not allowed'));
  },
  credentials: true
}));

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', authRoutes);
app.use('/api', agentRoutes);
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  tls: MONGODB_URI.includes('+srv'),
  tlsAllowInvalidCertificates: false,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

export default app;
