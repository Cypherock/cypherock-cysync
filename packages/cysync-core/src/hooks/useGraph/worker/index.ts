import type {
  CalculatePortfolioGraphDataParams,
  CalculatePortfolioGraphDataType,
} from '@cypherock/cysync-core-workers';

import { createWorkerFunctionCaller } from '~/utils/worker';

export const calculatePortfolioGraphDataWithWorker = createWorkerFunctionCaller<
  CalculatePortfolioGraphDataParams,
  ReturnType<CalculatePortfolioGraphDataType>
>(new URL('../../../generated/workers/graph', import.meta.url));
