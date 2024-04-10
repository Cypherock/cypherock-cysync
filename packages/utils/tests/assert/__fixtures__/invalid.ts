import { AssertInValidTestCases } from './types';

export const invalid: AssertInValidTestCases[] = [
  {
    name: 'undefined',
    condition: undefined,
    error: 'Invalid argument',
    errorMessage: 'AssertionError: Invalid argument',
  },
  {
    name: 'null',
    condition: null,
    error: 'Invalid argument',
    errorMessage: 'AssertionError: Invalid argument',
  },
  {
    name: 'false',
    condition: false,
    error: 'Invalid argument',
    errorMessage: 'AssertionError: Invalid argument',
  },
  {
    name: 'false with custom error',
    condition: false,
    error: new Error('Custom error'),
    errorMessage: 'Custom error',
  },
];
