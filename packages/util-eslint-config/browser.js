const baseRules = require('./base');

module.exports = {
  ...baseRules,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [...baseRules.extends, 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [...baseRules.plugins, 'react'],
  rules: {
    ...baseRules.rules,
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'no-use-before-define': 'off',
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],
    'react/jsx-props-no-spreading': 'off',
  },
};
