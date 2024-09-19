import { z } from 'zod';

export const fetchMessagesResponse = z.object({
  unencryptedData: z.object({
    data: z.array(
      z.object({
        tag: z.string(),
        message: z.string(),
      }),
    ),
    sessionKey: z.string().optional(),
    sessionId: z.string().optional(),
  }),
  encryptedMessage: z.string(),
});

export const editExecutorMessageResponseSchema = z.object({
  success: z.boolean(),
});

export type InheritanceFetchMessagesResponse = z.infer<
  typeof fetchMessagesResponse
>;
export type InheritanceEditExecutorMessageResponse = z.infer<
  typeof editExecutorMessageResponseSchema
>;
