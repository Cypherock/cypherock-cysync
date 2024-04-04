import { FormatDateToUTCStringTestCase } from './types';

export const valid: FormatDateToUTCStringTestCase[] = [
  {
    input: 1712068357391,
    output: '2024-04-02 14:32:37',
  },
  {
    input: 1640995200000,
    output: '2022-01-01 00:00:00',
  },
  {
    input: 1672531199000,
    output: '2022-12-31 23:59:59',
  },
  {
    input: 2556138612000,
    output: '2050-12-31 22:30:12',
  },
];
