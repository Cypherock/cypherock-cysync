export type AssertInValidTestCases = {
  name: string;
  condition: null | undefined | false;
  error: string | Error;
  errorMessage: string;
};

export type AssertValidTestCases = {
  name: string;
  condition: string | number | object | symbol | CallableFunction | true;
};

export interface IFixtures {
  valid: AssertValidTestCases[];
  invalid: AssertInValidTestCases[];
}
