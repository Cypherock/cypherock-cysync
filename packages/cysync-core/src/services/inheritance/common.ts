import { z } from 'zod';

export const inheritanceBaseUrl = 'http://localhost:2000';

export const otpDetailSchema = z.object({
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});
