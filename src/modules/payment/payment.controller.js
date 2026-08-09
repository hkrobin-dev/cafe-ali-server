import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';
import * as paymentService from './payment.service.js';

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const result = await paymentService.createPaymentIntent(req.body.cartIds, req.user._id);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, result));
});

export const createPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.createPayment(req.body, req.user);
  res.status(STATUS.CREATED).json(new ApiResponse(STATUS.CREATED, payment, 'Payment recorded'));
});

// GET /payments/:email - JWT ownership enforced via verifyOwnership middleware
export const getPaymentsByEmail = asyncHandler(async (req, res) => {
  if (req.params.email !== req.user.email && req.user.role !== 'admin') {
    throw new ApiError(STATUS.FORBIDDEN, 'Forbidden access.');
  }
  const payments = await paymentService.getPaymentsByEmail(req.params.email);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, payments));
});
