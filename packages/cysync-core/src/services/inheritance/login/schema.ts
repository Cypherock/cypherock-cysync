import { z } from 'zod';

import { otpDetailSchema } from '../common';

export const InheritanceLoginConcernMap = {
  LOGIN: 'WALLET_LOGIN_CHALLENGE',
  REGISTER: 'WALLET_REGISTRATION_CHALLENGE',
} as const;

export type InheritanceLoginConcern =
  (typeof InheritanceLoginConcernMap)[keyof typeof InheritanceLoginConcernMap];

export const InheritanceLoginEmailTypeMap = {
  PRIMARY: 'PRIMARY',
  ALTERNATE: 'ALTERNATE',
} as const;

export type InheritanceLoginEmailType =
  (typeof InheritanceLoginEmailTypeMap)[keyof typeof InheritanceLoginEmailTypeMap];

const loginConcernSchema = z.enum([
  InheritanceLoginConcernMap.LOGIN,
  InheritanceLoginConcernMap.REGISTER,
]);

export const initResultSchema = z.object({
  requestId: z.string(),
  challenge: z.string(),
  concern: loginConcernSchema,
});

export const validateResultSchema = z.object({
  success: z.boolean(),
  concern: loginConcernSchema,
  otpDetails: z.array(otpDetailSchema).optional(),
  wallet: z
    .object({
      owner: z
        .object({
          name: z.string().optional(),
          email: z.string().optional(),
          alternateEmail: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .nullish(),
});

export const resendResultSchema = z.object({
  requestId: z.string(),
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});

export const registerVerifyResultSchema = z.object({
  authToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

export const verifyResultSchema = z.object({
  authToken: z.string(),
  refreshToken: z.string(),
});

export const registerResultSchema = z.object({
  otpDetails: z.array(otpDetailSchema),
});

export const refreshAccessTokenResultSchema = z.object({
  authToken: z.string(),
});

const genericSuccessResult = z.object({
  success: z.boolean().optional(),
});

export type ReminderPeriod = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export type NomineeType = 'PRIMARY' | 'ALTERNATE';

export const updateNomineesResultSchema = z.object({
  success: z.boolean().optional(),
  otpDetails: otpDetailSchema
    .extend({ requestId: z.string() })
    .array()
    .optional(),
});
export const updateExecutorResultSchema = genericSuccessResult;
export const updateReminderResultSchema = genericSuccessResult;
export const clearMeataDataResultSchema = genericSuccessResult;

export type InheritanceLoginInitResponse = z.infer<typeof initResultSchema>;
export type InheritanceLoginResendResponse = z.infer<typeof resendResultSchema>;
export type InheritanceLoginVerifyResponse = z.infer<typeof verifyResultSchema>;
export type InheritanceLoginRegisterVerifyResponse = z.infer<
  typeof registerVerifyResultSchema
>;
export type InheritanceLoginValidateResponse = z.infer<
  typeof validateResultSchema
>;
export type InheritanceLoginRegisterResponse = z.infer<
  typeof registerResultSchema
>;
export type InheritanceLoginRefreshAccessTokenResponse = z.infer<
  typeof refreshAccessTokenResultSchema
>;
