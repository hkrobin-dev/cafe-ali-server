import { z } from 'zod';
import mongoose from 'mongoose';

const objectId = z.string().refine((v) => mongoose.Types.ObjectId.isValid(v), 'Invalid id');

export const createPaymentIntentSchema = z.object({
  body: z.object({
    cartIds: z.array(objectId).min(1, 'At least one cart item is required'),
  }),
});

export const createPaymentSchema = z.object({
  body: z.object({
    transactionId: z.string().min(4),
    cartIds: z.array(objectId).min(1),
  }),
});
