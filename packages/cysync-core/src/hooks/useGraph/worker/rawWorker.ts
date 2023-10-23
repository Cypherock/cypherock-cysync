import { createWorkerFunction } from '~/utils/worker/worker';

import { calculatePortfolioGraphData } from '../helper';

createWorkerFunction(calculatePortfolioGraphData);

export {};
