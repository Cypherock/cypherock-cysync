module.exports = {
  root: true,
  extends: ['@cypherock/eslint-config/node'],
  rules: {
    'no-underscore-dangle': 'off',
    'no-async-promise-executor': 'off',
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
