import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import { registerUser, loginUser, refreshUserSession, logoutUser, requestResetEmail, resetPassword } from '../controllers/authController.js';
import { registerUserSchema, loginUserSchema, requestResetEmailSchema, resetPasswordSchema } from '../validations/authValidation.js';

const router = Router();

// POST /auth/register — user registration
router.post('/auth/register', celebrate({ [Segments.BODY]: registerUserSchema }), registerUser);

// POST /auth/login — user login
router.post('/auth/login', celebrate({ [Segments.BODY]: loginUserSchema }), loginUser);

// POST /auth/refresh — refresh session
router.post('/auth/refresh', refreshUserSession);

// POST /auth/logout — user logout
router.post('/auth/logout', logoutUser);

// POST /auth/request-reset-email — send password reset email
router.post('/auth/request-reset-email', celebrate({ [Segments.BODY]: requestResetEmailSchema }), requestResetEmail);

// POST /auth/reset-password — reset password
router.post('/auth/reset-password', celebrate({ [Segments.BODY]: resetPasswordSchema }), resetPassword);

export default router;
