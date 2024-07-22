import {
  CalculatePortfolioGraphDataParams,
  CalculatePortfolioGraphDataType,
  WorkerFunctions,
} from '@cypherock/cysync-core-workers';

import { createWorkerFunctionCaller } from '~/utils/worker';

export const calculatePortfolioGraphDataWithWorker = createWorkerFunctionCaller<
  CalculatePortfolioGraphDataParams,
  ReturnType<CalculatePortfolioGraphDataType>
>(WorkerFunctions.calculatePortfolioGraphData);
