import express from 'express';
import { login, logout, checkAuth, getLoginAttempts } from '../Controllers/auth.js';
import { protect } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/check', protect, checkAuth);
router.get('/attempts', getLoginAttempts);

export default router;
