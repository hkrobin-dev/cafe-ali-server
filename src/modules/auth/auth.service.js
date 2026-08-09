import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../user/user.model.js';
import { generateAccessToken } from '../../utils/generateToken.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';
import { env } from '../../config/env.js';
import { ROLES } from '../../constants/roles.js';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject();
  delete user.password;
  return user;
};

export const registerUser = async ({ name, email, password, photoURL }) => {
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new ApiError(STATUS.CONFLICT, 'An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    photoURL: photoURL || '',
    role: ROLES.USER,
    provider: 'password',
  });

  const accessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), accessToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user || !user.password) {
    throw new ApiError(STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(STATUS.UNAUTHORIZED, 'Invalid email or password.');
  }

  const accessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), accessToken };
};

// Preserves legacy /jwt contract: issues a token for an already-known email (post-Firebase-auth flow)
export const issueLegacyJwt = async ({ email }) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(STATUS.NOT_FOUND, 'No account found for this email.');
  }
  const accessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
  return { accessToken };
};

export const googleAuth = async ({ idToken }) => {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new ApiError(STATUS.INTERNAL, 'Google auth is not configured on the server.');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch (_err) {
    throw new ApiError(STATUS.UNAUTHORIZED, 'Invalid Google token.');
  }

  const { email, name, picture, sub: googleId } = payload;

  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({
      name,
      email,
      photoURL: picture || '',
      role: ROLES.USER,
      provider: 'google',
      googleId,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    user.provider = 'google';
    await user.save();
  }

  const accessToken = generateAccessToken({ userId: user._id, email: user.email, role: user.role });
  return { user: sanitizeUser(user), accessToken };
};
