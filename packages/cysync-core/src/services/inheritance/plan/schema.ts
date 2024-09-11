import { z } from 'zod';

export const createResultSchema = z.object({});
export const applyCouponResultSchema = z.object({});
export const activateResultSchema = z.object({});

export type InheritancePlanCreateResponse = z.infer<typeof createResultSchema>;
export type InheritancePlanApplyCouponResponse = z.infer<
  typeof applyCouponResultSchema
>;
export type InheritancePlanActivateResponse = z.infer<
  typeof activateResultSchema
>;
