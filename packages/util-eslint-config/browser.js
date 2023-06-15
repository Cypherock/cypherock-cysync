module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'import', 'no-null'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'no-null/no-null': 'warn',
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.ts?(x)',
          '**/tests/**/*.ts?(x)',
          '**/__mocks__/**/*.ts?(x)',
          '**/__fixtures__/**/*.ts?(x)',
          '**/__helpers__/**/*.ts?(x)',
        ],
      },
    ],
    '@typescript-eslint/prefer-readonly': 'error',

    // React specific
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    'no-use-before-define': 'off',
    'react/function-component-definition': [
      2,
      { namedComponents: 'arrow-function' },
    ],
    'react/jsx-props-no-spreading': 'off',
  },
};
