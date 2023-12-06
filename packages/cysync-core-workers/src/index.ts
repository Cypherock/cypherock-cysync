import { calculatePortfolioGraphData } from './graph';
import { createWorkerFunction } from './utils';

createWorkerFunction(calculatePortfolioGraphData);

export type {
  CalculatePortfolioGraphDataParams,
  CalculatePortfolioGraphDataType,
} from './graph';
