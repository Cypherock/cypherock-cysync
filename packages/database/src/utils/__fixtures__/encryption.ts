import { TestData } from './types';

export const testData: TestData = {
  valid: {
    hashing: [
      {
        message: 'sampleMessage',
        expectedHashKey:
          '1241577c3bb040e87a647d60bf2b373a09afd40624add04ce7d00321d0bb4678',
      },
      {
        message: '',
        expectedHashKey:
          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    ],
    encryption: [
      {
        data: ['sampleData'],
        message: ['sampleMessage'],
      },
      {
        data: ['sampleData1, sampleData2'],
        message: ['sampleMessage'],
      },
      {
        data: ['sampleData'],
        message: ['sampleMessage1', 'sampleMessage2'],
      },
      {
        data: ['sampleData1, sampleData2'],
        message: ['sampleMessage1', 'sampleMessage2'],
      },
    ],
  },
  invalid: {
    hashing: [],
    encryption: [
      {
        data: ['sampleData'],
        message: null,
      },
      {
        data: ['sampleData'],
        message: undefined,
      },
      {
        data: null,
        message: ['sampleMessage'],
      },
      {
        data: undefined,
        message: ['sampleMessage'],
      },
    ],
  },
};
