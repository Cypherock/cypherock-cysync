import { z } from 'zod';

import { otpDetailSchema } from '../../common';

export const initResultSchema = z.object({
  requestId: z.string(),
  otpDetails: z.array(otpDetailSchema).optional(),
});

export const verifyResultSchema = z.object({
  wallets: z
    .array(
      z.object({
        _id: z.string(),
        wallet: z.string(),
        fullName: z.string().optional(),
        role: z.string().optional(),
        subscription: z
          .array(
            z.object({
              order: z
                .object({
                  _id: z.string(),
                  planType: z.string().optional(),
                  activationDate: z.string().optional(),
                  expiryDate: z.string().optional(),
                })
                .optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
});

export type InheritanceSyncPlansInitResponse = z.infer<typeof initResultSchema>;
export type InheritanceSyncPlansVerifyResponse = z.infer<
  typeof verifyResultSchema
>;
