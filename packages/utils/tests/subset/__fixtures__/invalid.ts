export const invalid = [
  {
    subset: { a: 1 },
    superSet: {},
  },
  {
    subset: { a: 1, b: 2 },
    superSet: { a: 1 },
  },
  {
    subset: { a: { a: 1 } },
    superSet: { a: { b: 1 } },
  },
  {
    subset: { a: { a: 1, b: 1 } },
    superSet: { a: { a: 1 } },
  },
];
