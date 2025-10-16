import { randomBytes } from 'crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

// Creates new session for a user and returns the created session document
export async function createSession(userId) {
  // generate tokens
  const accessToken = randomBytes(24).toString('hex');
  const refreshToken = randomBytes(32).toString('hex');

  const now = Date.now();
  const accessTokenValidUntil = new Date(now + FIFTEEN_MINUTES);
  const refreshTokenValidUntil = new Date(now + ONE_DAY);

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session;
}

// Attaches session cookies to response
export function setSessionCookies(res, session) {
  // unified cookie options per spec
  const base = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('accessToken', session.accessToken, {
    ...base,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...base,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', String(session._id), {
    ...base,
    maxAge: ONE_DAY,
  });
}
