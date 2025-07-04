import express from 'express';
import { login, logout, me } from '../controllers/authController';
import { createUser } from '../controllers/userController';

const router = express.Router();


// POST /api/auth/login      → { email, password }  → { token, user: {...} }
router.post('/login', login);

// POST /api/auth/logout     → (no body; clears cookie) → { success: true }
router.post('/logout', logout);

// GET  /api/auth/me         → (JWT cookie or Authorization header) → { user: {...} }
router.get('/me', me);

export default router;
