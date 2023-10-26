(globalThis as any).Buffer = require('safe-buffer').Buffer;

import { createWorkerFunction } from './utils';
import { calculatePortfolioGraphData } from './graph';

createWorkerFunction(calculatePortfolioGraphData);
