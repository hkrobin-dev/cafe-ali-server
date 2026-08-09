import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { STATUS } from '../../constants/statusCodes.js';
import * as userService from './user.service.js';

export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMe(req.user._id);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, user));
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateMe(req.user._id, req.body);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, user, 'Profile updated'));
});

// Legacy: GET /user/admin/:email
export const checkIsAdmin = asyncHandler(async (req, res) => {
  const result = await userService.checkIsAdmin(req.params.email);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, result));
});

export const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, search, role } = req.query;
  const result = await userService.listUsers({ page, limit, search, role });
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, result));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, user, 'Role updated'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, null, 'User deleted'));
});
