import { ReviewModel } from './review.model.js';
import { ItemModel } from '../item/item.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { STATUS } from '../../constants/statusCodes.js';

const recalculateItemRating = async (itemId) => {
  const stats = await ReviewModel.aggregate([
    { $match: { item: itemId } },
    { $group: { _id: '$item', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const { avgRating = 0, count = 0 } = stats[0] || {};
  await ItemModel.findByIdAndUpdate(itemId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: count,
  });
};

export const listAllReviews = async () => {
  return ReviewModel.find().populate('user', 'name photoURL').sort({ createdAt: -1 });
};

export const listReviewsByItem = async (itemId) => {
  return ReviewModel.find({ item: itemId }).populate('user', 'name photoURL').sort({ createdAt: -1 });
};

export const createReview = async (userId, { item, rating, comment }) => {
  const existing = await ReviewModel.findOne({ item, user: userId });
  if (existing) {
    throw new ApiError(STATUS.CONFLICT, 'You have already reviewed this item.');
  }

  const review = await ReviewModel.create({ item, user: userId, rating, comment });
  await recalculateItemRating(item);
  return review;
};

export const updateReview = async (reviewId, userId, isAdmin, updates) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) throw new ApiError(STATUS.NOT_FOUND, 'Review not found.');

  if (String(review.user) !== String(userId) && !isAdmin) {
    throw new ApiError(STATUS.FORBIDDEN, 'You can only edit your own review.');
  }

  Object.assign(review, updates);
  await review.save();
  await recalculateItemRating(review.item);
  return review;
};

export const deleteReview = async (reviewId, userId, isAdmin) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) throw new ApiError(STATUS.NOT_FOUND, 'Review not found.');

  if (String(review.user) !== String(userId) && !isAdmin) {
    throw new ApiError(STATUS.FORBIDDEN, 'You can only delete your own review.');
  }

  const itemId = review.item;
  await review.deleteOne();
  await recalculateItemRating(itemId);
};
