module.exports = {
  root: true,
  extends: ['@cypherock/eslint-config/node'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
