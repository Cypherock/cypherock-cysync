import { z } from 'zod';

export const createResultSchema = z.object({});
export const applyCouponResultSchema = z.object({});
export const checkCouponResultSchema = z.object({
  duration: z.string(),
  planType: z.string(),
});
export const activateResultSchema = z.object({});
export const getPlanResultSchema = z.object({
  emailConfig: z
    .object({
      frequency: z.string().optional(),
    })
    .optional(),
  owner: z
    .object({
      email: z.string().optional(),
      alternateEmail: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  executor: z
    .object({
      nominee: z.array(z.string().optional()).optional(),
      email: z.string().optional(),
      alternateEmail: z.string().optional(),
      name: z.string().optional(),
    })
    .optional(),
  _id: z.string(),
  wallet: z.string(),
  fullName: z.string().optional(),
  metadata: z
    .object({
      walletPublicKey: z.string().optional(),
      seedPublicKey: z.string().optional(),
      loginDisabled: z.boolean().optional(),
      requirePasswordUpdate: z.boolean().optional(),
      primaryEmailVerified: z.boolean().optional(),
      alternateEmailVerified: z.boolean().optional(),
    })
    .optional(),
  nominee: z
    .array(
      z.object({
        email: z.string().optional(),
        alternateEmail: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .optional(),
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
        walletPlan: z.string(),
        activationDate: z.string(),
        _id: z.string(),
      }),
    )
    .optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
});

export type InheritancePlanCreateResponse = z.infer<typeof createResultSchema>;
export type InheritancePlanApplyCouponResponse = z.infer<
  typeof applyCouponResultSchema
>;
export type InheritancePlanActivateResponse = z.infer<
  typeof activateResultSchema
>;
export type InheritancePlanGetPlanResponse = z.infer<
  typeof getPlanResultSchema
>;
