import { jest } from '@jest/globals';

export interface TestApp {
  abort: () => Promise<void>;
}

export const testApp: TestApp = {
  abort: jest.fn(() => Promise.resolve()),
};
