import { describe, it } from 'node:test';
import assert from 'node:assert';
import 'dotenv/config';
import User from './models/User.js';
import authRoutes from './routes/auth.js';

// Basic smoke tests
describe('App ESM Smoke Tests', () => {
  it('should have required environment variables defined', () => {
    // Just verifying variables exist in process.env
    assert.ok(process.env.MONGODB_URI, 'MONGODB_URI should be defined');
    assert.ok(process.env.GROQ_API_KEY, 'GROQ_API_KEY should be defined');
  });

  it('should load User model without errors', () => {
    assert.ok(User);
    assert.strictEqual(User.modelName, 'User');
  });

  it('should load routes without errors', () => {
    assert.ok(authRoutes);
  });
});
