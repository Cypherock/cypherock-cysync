import { z } from 'zod';

import { config } from '../../config';

export const inheritanceBaseUrl = `${config.API_CYPHEROCK}/inheritance`;

export const otpDetailSchema = z.object({
  maskedEmail: z.string(),
  retriesRemaining: z.number(),
  otpExpiry: z.string().datetime(),
});

export const InheritanceUserTypeMap = {
  owner: 'OWNER',
  nominee: 'NOMINEE',
} as const;

export type InheritanceUserType =
  (typeof InheritanceUserTypeMap)[keyof typeof InheritanceUserTypeMap];
