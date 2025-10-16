import { Router } from 'express';
import { registerUser, loginUser, refreshUserSession, logoutUser } from '../controllers/authController.js';
import { registerUserSchema, loginUserSchema } from '../validations/authValidation.js';

const router = Router();

// POST /auth/register — user registration
router.post('/auth/register', registerUserSchema, registerUser);

// POST /auth/login — user login
router.post('/auth/login', loginUserSchema, loginUser);

// POST /auth/refresh — refresh session
router.post('/auth/refresh', refreshUserSession);

// POST /auth/logout — user logout
router.post('/auth/logout', logoutUser);

export default router;
