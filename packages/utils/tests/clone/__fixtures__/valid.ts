import { CloneFixtures } from './types';

const baseObject = { a: 1, b: 'str', c: true, d: null };

const circularObject: any = {
  ...baseObject,
};
circularObject['e'] = circularObject;

export const valid: CloneFixtures['valid'] = [
  {
    name: 'empty object',
    param: {},
    result: {},
  },
  {
    name: 'base object',
    param: { ...baseObject },
    result: { ...baseObject },
  },
  {
    name: 'circular object',
    param: { ...circularObject },
    result: { ...circularObject, e: { ...circularObject, e: '[Circular]' } },
  },
  {
    name: 'circular object with function',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    param: { ...circularObject, f: () => {} },
    result: {
      ...circularObject,
      e: { ...circularObject, e: '[Circular]' },
      f: '[Function]',
    },
  },
];
