module.exports = {
  extends: [
    'airbnb',
    'prettier',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/strict',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'no-null'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'no-null/no-null': 'warn',
    'import/extensions': 0,
    'import/no-cycle': 0,
    'import/prefer-default-export': 0,
    'import/order': [
      1,
      {
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          'sibling',
          'parent',
          'index',
        ],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-continue': 0,
    'no-underscore-dangle': 0,
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
  },
};
