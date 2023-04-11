module.exports = {
  root: true,
  extends: ['custom/node'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['src/*.ts'],
      },
    ],
  },
};
