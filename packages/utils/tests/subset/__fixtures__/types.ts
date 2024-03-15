export type TestCase = {
  subset: any;
  superSet: any;
};

export type SubSetFixtures = {
  valid: TestCase[];
  invalid: TestCase[];
};
