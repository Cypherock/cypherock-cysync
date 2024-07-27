import { z } from 'zod';

export const startResultSchema = z.object({
  requestId: z.string(),
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
  otpLength: z.number(),
});

export const resendResultSchema = z.object({
  requestId: z.string(),
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});

export const verifyResultSchema = z.object({
  plans: z
    .array(
      z.object({
        __id: z.string(),
      }),
    )
    .optional(),
  isSuccess: z.boolean(),
  retriesRemaining: z.number().optional(),
  otpExpiry: z.string().datetime().optional(),
});

export type InheritanceSyncPlansStartResponse = z.infer<
  typeof startResultSchema
>;
export type InheritanceSyncPlansResendResponse = z.infer<
  typeof resendResultSchema
>;
export type InheritanceSyncPlansVerifyResponse = z.infer<
  typeof verifyResultSchema
>;
