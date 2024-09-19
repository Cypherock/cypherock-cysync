import {
  editExecutorMessageResponseSchema,
  fetchMessagesResponse,
} from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../../../utils';
import { inheritanceBaseUrl } from '../../common';

export {
  type InheritanceEditExecutorMessageResponse,
  type InheritanceFetchMessagesResponse,
} from './schema';

const baseUrl = `${inheritanceBaseUrl}/wallet-account`;

const fetchMessages = async (
  params: {
    wallet: boolean;
    executor: boolean;
    nominee: boolean;
    message: boolean;
  },
  authToken: string,
) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      fetchMessagesResponse,
      `${baseUrl}/recover`,
      params,
      authToken,
    ),
  );

const updateExecutorMessage = async (
  params: { executorMessage: string },
  authToken: string,
) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      editExecutorMessageResponseSchema,
      `${baseUrl}/edit`,
      params,
      authToken,
    ),
  );

export const inheritanceEditPlansService = {
  fetchMessages,
  updateExecutorMessage,
};
