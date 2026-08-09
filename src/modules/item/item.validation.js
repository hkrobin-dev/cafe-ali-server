import { z } from 'zod';

export const createItemSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120),
    category: z.string().min(2).max(60),
    price: z.number().positive('Price must be greater than 0'),
    image: z.string().url('Image must be a valid URL'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    recipe: z.string().optional(),
    quantity: z.number().int().nonnegative().optional(),
    location: z.string().optional(),
  }),
});

export const updateItemSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(120).optional(),
    category: z.string().min(2).max(60).optional(),
    price: z.number().positive().optional(),
    image: z.string().url().optional(),
    description: z.string().min(10).optional(),
    recipe: z.string().optional(),
    quantity: z.number().int().nonnegative().optional(),
    location: z.string().optional(),
  }),
});
