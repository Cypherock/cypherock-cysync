import { recoverResultSchema } from './schema';

import {
  AuthTokenConfig,
  makePostRequest,
  runAndHandleServerErrors,
} from '../../../utils';
import { inheritanceBaseUrl } from '../../common';

export { type InheritanceRecoverPlanResponse } from './schema';

const baseUrl = `${inheritanceBaseUrl}/wallet-account`;

const recover = async (params: {
  sessionId: string;
  authTokenConfig: AuthTokenConfig;
  wallet?: boolean;
  executor?: boolean;
  nominee?: boolean;
  message?: boolean;
}) =>
  runAndHandleServerErrors(() =>
    makePostRequest(
      recoverResultSchema,
      `${baseUrl}/recover`,
      {
        sessionId: params.sessionId,
        wallet: params.wallet,
        executor: params.executor,
        nominee: params.nominee,
        message: params.message,
      },
      params.authTokenConfig,
    ),
  );

export const inheritanceRecoverPlansService = {
  recover,
};
