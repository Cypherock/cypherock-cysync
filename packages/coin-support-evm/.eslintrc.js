module.exports = {
  root: true,
  extends: ['@cypherock/eslint-config/browser'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
