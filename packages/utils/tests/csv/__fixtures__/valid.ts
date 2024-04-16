import { CreateCSVFromObjectTestCase } from './types';

export const valid: CreateCSVFromObjectTestCase[] = [
  {
    name: 'Only headers',
    input: {
      headers: [
        {
          name: 'Header 1',
          key: '',
        },
        {
          name: 'Header 2 👋',
          key: '',
        },
        {
          name: 'Header, 3',
          key: '',
        },
      ],
      rows: [],
    },
    output: 'Header 1,Header 2 👋,"Header, 3"\n',
  },
  {
    name: 'Header with rows',
    input: {
      headers: [
        {
          name: 'Header 1',
          key: '1',
        },
        {
          name: 'Header 2 👋',
          key: '2',
        },
        {
          name: 'Header, 3',
          key: '3',
        },
      ],
      rows: [
        {
          1: 'test',
          2: 'test 2',
          3: 3,
        },
        {
          1: 'tes, t',
          2: 'te"st 2',
          3: 7688,
        },
        {
          2: 'test 2',
          3: 3,
        },
      ],
    },
    output:
      'Header 1,Header 2 👋,"Header, 3"\ntest,test 2,3\n"tes, t","te""st 2",7688\n,test 2,3\n',
  },
];
