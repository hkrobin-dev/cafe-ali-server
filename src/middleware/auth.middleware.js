import { verifyAccessToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { STATUS } from '../constants/statusCodes.js';
import { UserModel } from '../modules/user/user.model.js';

// Verifies a Bearer JWT, attaches decoded payload + fresh user doc to req.user
export const verifyJWT = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    throw new ApiError(STATUS.UNAUTHORIZED, 'Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (_err) {
    throw new ApiError(STATUS.UNAUTHORIZED, 'Invalid or expired token.');
  }

  const user = await UserModel.findById(decoded.userId).select('-password');
  if (!user) {
    throw new ApiError(STATUS.UNAUTHORIZED, 'User for this token no longer exists.');
  }

  req.user = user; // full mongoose doc (minus password)
  next();
});

// Restricts access to the given roles. Use AFTER verifyJWT.
export const verifyRoles =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(STATUS.UNAUTHORIZED, 'Not authenticated.');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(STATUS.FORBIDDEN, 'You do not have permission to perform this action.');
    }
    next();
  };

export const verifyAdmin = verifyRoles('admin');

// Ensures req.user._id matches a :email or :userId param / owns the resource being accessed
export const verifyOwnership = (paramKey = 'email') => (req, _res, next) => {
  const paramValue = req.params[paramKey] || req.query[paramKey];
  const isOwner =
    paramValue === req.user.email || paramValue === String(req.user._id);
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ApiError(STATUS.FORBIDDEN, 'Forbidden access: not the resource owner.');
  }
  next();
};
