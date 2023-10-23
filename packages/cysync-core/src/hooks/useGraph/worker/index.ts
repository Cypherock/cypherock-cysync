import { createWorkerFunctionCaller } from '~/utils/worker';

import {
  calculatePortfolioGraphData,
  CalculatePortfolioGraphDataParams,
} from '../helper';

export const calculatePortfolioGraphDataWithWorker = createWorkerFunctionCaller<
  CalculatePortfolioGraphDataParams,
  ReturnType<typeof calculatePortfolioGraphData>
>(new URL('./rawWorker', import.meta.url));
