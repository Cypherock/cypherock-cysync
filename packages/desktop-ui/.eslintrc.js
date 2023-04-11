module.exports = {
  root: true,
  extends: ['custom/browser'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
