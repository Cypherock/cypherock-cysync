module.exports = {
  root: true,
  extends: ['@cypherock/eslint-config/browser', 'plugin:storybook/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
