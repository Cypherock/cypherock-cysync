import {
  CreateBcryptHashParams,
  VerifyBcryptHashParams,
  WorkerFunctions,
} from '@cypherock/cysync-core-workers';

import { createWorkerFunctionCaller } from './worker';

export const createBcryptHash = createWorkerFunctionCaller<
  CreateBcryptHashParams,
  string
>(WorkerFunctions.createBcryptHash, true);

export const verifyBcryptHash = createWorkerFunctionCaller<
  VerifyBcryptHashParams,
  boolean
>(WorkerFunctions.verifyBcryptHash, true);
