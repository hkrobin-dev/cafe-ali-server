import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required').max(80),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(3, 'Subject is required').max(150),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  }),
});

export const updateContactSchema = z.object({
  body: z.object({
    status: z.enum(['new', 'read', 'resolved']),
  }),
});
