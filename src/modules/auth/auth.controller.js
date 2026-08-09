import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { STATUS } from '../../constants/statusCodes.js';
import * as authService from './auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(STATUS.CREATED).json(new ApiResponse(STATUS.CREATED, result, 'Registration successful'));
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, result, 'Login successful'));
});

// Legacy endpoint, kept for existing frontend compatibility
export const issueJwt = asyncHandler(async (req, res) => {
  const result = await authService.issueLegacyJwt(req.body);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, result, 'Token issued'));
});

export const googleAuth = asyncHandler(async (req, res) => {
  const result = await authService.googleAuth(req.body);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, result, 'Google login successful'));
});
