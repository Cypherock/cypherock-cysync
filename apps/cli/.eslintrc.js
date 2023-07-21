module.exports = {
  root: true,
  extends: ['@cypherock/eslint-config/node.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  rules: {
    'no-use-before-define': 'off',
    'no-console': 'off',
  },
};
