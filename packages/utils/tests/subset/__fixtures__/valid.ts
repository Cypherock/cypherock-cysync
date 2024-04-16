export const valid = [
  {
    subset: {},
    superSet: {},
  },
  {
    subset: {},
    superSet: { a: 1 },
  },
  {
    subset: { a: 1 },
    superSet: { a: 1, b: 2 },
  },
  {
    subset: { a: { a: 1 } },
    superSet: { a: { a: 1 } },
  },
  {
    subset: { a: { a: 1 } },
    superSet: { a: { a: 1, b: 1 } },
  },
];
