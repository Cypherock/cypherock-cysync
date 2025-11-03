import { z } from 'zod';

export const otpDetailSchema = z.object({
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});

export const loginResultSchema = z.object({
  otpDetails: otpDetailSchema,
});

export const loginOtpVerificationResultSchema = z.object({
  message: z.string(),
  user: z.object({
    _id: z.string(),
    email: z.string(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
});
