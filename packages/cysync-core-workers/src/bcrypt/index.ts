import bcrypt from 'bcryptjs';

import { CreateBcryptHashParams, VerifyBcryptHashParams } from './types';

export const createBcryptHash = (params: CreateBcryptHashParams) =>
  bcrypt.hash(params.value, params.salt);

export const verifyBcryptHash = (params: VerifyBcryptHashParams) =>
  bcrypt.compare(params.value, params.hash);
