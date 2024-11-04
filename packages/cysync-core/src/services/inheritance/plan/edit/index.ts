import { editExecutorMessageResponseSchema } from './schema';

import {
  AuthTokenConfig,
  makePostRequest,
  runAndHandleServerErrors,
} from '../../../utils';
import { inheritanceBaseUrl } from '../../common';

export { type InheritanceEditExecutorMessageResponse } from './schema';

const baseUrl = `${inheritanceBaseUrl}/wallet-account`;

const updateExecutorMessage = async (params: {
  executorMessage: string;
  sessionId: string;
  authTokenConfig: AuthTokenConfig;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      editExecutorMessageResponseSchema,
      `${baseUrl}/edit`,
      params,
      params.authTokenConfig,
    ),
  );

export const inheritanceEditPlansService = {
  updateExecutorMessage,
};
