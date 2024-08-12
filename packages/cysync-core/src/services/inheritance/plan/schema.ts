import { z } from 'zod';

export const createResultSchema = z.object({});

export type InheritancePlanCreateResponse = z.infer<typeof createResultSchema>;
