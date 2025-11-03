import { cantonBaseUrl } from './common';
import { loginResultSchema } from './schema';

import { makePostRequest, runAndHandleServerErrors } from '../utils';

const login = async (params: { email: string }) =>
  runAndHandleServerErrors(() =>
    makePostRequest(loginResultSchema, `${cantonBaseUrl}/user/login`, params),
  );

export const cantonService = { login };
