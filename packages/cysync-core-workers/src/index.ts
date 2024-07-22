import { createBcryptHash, verifyBcryptHash } from './bcrypt';
import { calculatePortfolioGraphData } from './graph';
import { addWorkerHandlers, IHandler, initWorker } from './utils';

export const WorkerFunctions = {
  calculatePortfolioGraphData: 'calculatePortfolioGraphData',
  createBcryptHash: 'createBcryptHash',
  verifyBcryptHash: 'verifyBcryptHash',
};

const handlers: IHandler[] = [
  {
    name: WorkerFunctions.calculatePortfolioGraphData,
    func: calculatePortfolioGraphData,
  },
  {
    name: WorkerFunctions.createBcryptHash,
    func: createBcryptHash,
  },
  {
    name: WorkerFunctions.verifyBcryptHash,
    func: verifyBcryptHash,
  },
];

if (globalThis.document === undefined) {
  addWorkerHandlers(handlers);
  initWorker();
}

export * from './graph/types';
export type { CalculatePortfolioGraphDataType } from './graph';
export * from './bcrypt/types';
