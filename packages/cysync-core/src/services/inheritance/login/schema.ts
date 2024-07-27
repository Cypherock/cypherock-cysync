import { z } from 'zod';

export const resendResultSchema = z.object({
  requestId: z.string(),
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});

export const verifyResultSchema = z.object({
  isSuccess: z.boolean(),
  retriesRemaining: z.number().optional(),
  otpExpiry: z.string().datetime().optional(),
});

export type InheritanceLoginResendResponse = z.infer<typeof resendResultSchema>;
export type InheritanceLoginVerifyResponse = z.infer<typeof verifyResultSchema>;
