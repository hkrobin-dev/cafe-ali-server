import { z } from 'zod';
import { ROLE_LIST } from '../../constants/roles.js';

export const updateMeSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(60).optional(),
    photoURL: z.string().url().optional().or(z.literal('')),
    phone: z.string().max(20).optional(),
    address: z.string().max(200).optional(),
  }),
});

export const updateRoleSchema = z.object({
  body: z.object({
    role: z.enum(ROLE_LIST, { errorMap: () => ({ message: `Role must be one of: ${ROLE_LIST.join(', ')}` }) }),
  }),
});
