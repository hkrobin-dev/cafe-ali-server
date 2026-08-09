import { z } from 'zod';
import mongoose from 'mongoose';

const objectId = z.string().refine((v) => mongoose.Types.ObjectId.isValid(v), 'Invalid item id');

export const createReviewSchema = z.object({
  body: z.object({
    item: objectId,
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
    comment: z.string().min(3, 'Comment must be at least 3 characters').max(1000),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(3).max(1000).optional(),
  }),
});
