import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { STATUS } from '../../constants/statusCodes.js';
import * as reviewService from './review.service.js';

export const listAllReviews = asyncHandler(async (_req, res) => {
  const reviews = await reviewService.listAllReviews();
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, reviews));
});

export const listReviewsByItem = asyncHandler(async (req, res) => {
  const reviews = await reviewService.listReviewsByItem(req.params.itemId);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, reviews));
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  res.status(STATUS.CREATED).json(new ApiResponse(STATUS.CREATED, review, 'Review submitted'));
});

export const updateReview = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const review = await reviewService.updateReview(req.params.id, req.user._id, isAdmin, req.body);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, review, 'Review updated'));
});

export const deleteReview = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  await reviewService.deleteReview(req.params.id, req.user._id, isAdmin);
  res.status(STATUS.OK).json(new ApiResponse(STATUS.OK, null, 'Review deleted'));
});
