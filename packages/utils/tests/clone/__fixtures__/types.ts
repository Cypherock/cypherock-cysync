export type TestCase = {
  name: string;
  param: any;
  result: any;
};

export type CloneFixtures = {
  valid: TestCase[];
};
