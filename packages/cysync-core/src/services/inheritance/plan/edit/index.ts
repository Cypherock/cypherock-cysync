import { executorMessageSchema } from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../../../utils';
import { inheritanceBaseUrl } from '../../common';

export { type InheritanceExecutorMessageResponse } from './schema';

const baseUrl = `${inheritanceBaseUrl}/wallet-account`;

const fetchExecutorMessage = async (params: {
  wallet: boolean;
  executor: boolean;
  nominee: boolean;
  message: boolean;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(executorMessageSchema, `${baseUrl}/recover`, params),
  );

const updateExecutorMessage = async (params: { executorMessage: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(executorMessageSchema, `${baseUrl}/edit`, params),
  );

export const inheritanceEditPlansService = {
  fetchExecutorMessage,
  updateExecutorMessage,
};
