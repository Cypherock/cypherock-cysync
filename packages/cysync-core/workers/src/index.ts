import { createWorkerFunction } from './utils';
import { calculatePortfolioGraphData } from './graph';

createWorkerFunction(calculatePortfolioGraphData);
