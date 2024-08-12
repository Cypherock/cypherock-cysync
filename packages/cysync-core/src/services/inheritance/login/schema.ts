import { z } from 'zod';

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

const otpDetailSchema = z.object({
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});

export const initResultSchema = z.object({
  requestId: z.string(),
  challenge: z.string(),
  concern: loginConcernSchema,
});

export const validateResultSchema = z.object({
  success: z.boolean(),
  concern: loginConcernSchema,
  otpDetails: z.array(otpDetailSchema).optional(),
});

export const resendResultSchema = z.object({
  requestId: z.string(),
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});

export const registerVerifyResultSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});

export const verifyResultSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const registerResultSchema = z.object({
  otpDetails: z.array(otpDetailSchema),
});

export const refreshAccessTokenResultSchema = z.object({
  accessToken: z.string(),
});

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
