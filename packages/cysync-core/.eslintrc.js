module.exports = {
  root: true,
  extends: ['@cypherock/eslint-config/browser'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  rules: { 'no-param-reassign': ['error', { props: false }] },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.eslint.json'],
      },
    },
  },
};
