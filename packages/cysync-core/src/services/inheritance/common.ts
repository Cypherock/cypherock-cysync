import { z } from 'zod';

export const inheritanceBaseUrl = 'https://api-inheritance-dev.cypherock.com';

export const otpDetailSchema = z.object({
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});
