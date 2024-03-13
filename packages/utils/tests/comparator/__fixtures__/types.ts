export type CreateComparatorTestCase = {
  name: string;
  input: {
    key: string;
    keyType: 'number' | 'string';
    first: any;
    second: any;
  };
};

export type CreateComparatorValidTestCase = CreateComparatorTestCase & {
  output: -1 | 0 | 1;
};

export type CreateComparatorInvalidTestCase = CreateComparatorTestCase & {
  errorMessage: string;
};

export interface IFixtures {
  valid: CreateComparatorValidTestCase[];
  invalid: CreateComparatorInvalidTestCase[];
}
