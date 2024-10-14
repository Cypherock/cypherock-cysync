import { editExecutorMessageResponseSchema } from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../../../utils';
import { inheritanceBaseUrl } from '../../common';

export { type InheritanceEditExecutorMessageResponse } from './schema';

const baseUrl = `${inheritanceBaseUrl}/wallet-account`;

const updateExecutorMessage = async (params: {
  executorMessage: string;
  sessionId: string;
  accessToken: string;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      editExecutorMessageResponseSchema,
      `${baseUrl}/edit`,
      params,
      params.accessToken,
    ),
  );

export const inheritanceEditPlansService = {
  updateExecutorMessage,
};
