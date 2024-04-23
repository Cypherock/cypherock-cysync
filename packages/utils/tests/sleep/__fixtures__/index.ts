export const fixtures = {
  valid: [
    0,
    200,
    1000,
    10000,
    8640000, // 24 * 60 * 60 * 1000 (24 hours)
  ],
  invalid: [
    86400001, // 24 * 60 * 60 * 1000 + 1 (more than 24 hours)
    -10,
    Infinity,
    -Infinity,
    NaN,
    10.1,
  ],
};
