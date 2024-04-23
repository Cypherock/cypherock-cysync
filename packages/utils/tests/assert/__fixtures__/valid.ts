import { AssertValidTestCases } from './types';

export const valid: AssertValidTestCases[] = [
  {
    name: 'non-empty string',
    condition: 'aksjdh',
  },
  {
    name: 'empty string',
    condition: '',
  },
  {
    name: 'object',
    condition: {},
  },
  {
    name: 'array',
    condition: [],
  },
  {
    name: 'positive number',
    condition: 1,
  },
  {
    name: 'number zero',
    condition: 0,
  },
  {
    name: 'negative number',
    condition: -12,
  },
  {
    name: 'true',
    condition: true,
  },
  {
    name: 'function',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    condition: () => {},
  },
];
