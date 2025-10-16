import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) throw createHttpError(400, 'Email in use');

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });

    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, 'User not found');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw createHttpError(401, 'Invalid credentials');


    await Session.deleteMany({ userId: user._id });
    const session = await createSession(user._id);
    setSessionCookies(res, session);

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies || {};
    if (!sessionId || !refreshToken) {
      throw createHttpError(401, 'Session not found');
    }

    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) throw createHttpError(401, 'Session not found');

    if (session.refreshTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Session token expired');
    }

    await Session.deleteOne({ _id: session._id });

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: 'Session refreshed' });
  } catch (e) {
    next(e);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies || {};
    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'none' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'none' });
    res.clearCookie('sessionId', { httpOnly: true, secure: true, sameSite: 'none' });

    res.status(204).send();
  } catch (e) {
    next(e);
  }
};
