module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__fixtures__/*',
  ],
  testTimeout: 500,
  preset: 'ts-jest',
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // ts-jest configuration goes here
      },
    ],
  },
  testEnvironment: 'jsdom',
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/', '/__fixtures__/', '/dist/'],
  testMatch: [
    '**/tests/**/*.[jt]s?(x)',
    '**/__tests__/**/*.[jt]s?(x)',
    '!**/setupTests.[jt]s?(x)',
    '!**/__mocks__/**/*.[jt]s?(x)',
    '!**/__helpers__/**/*.[jt]s?(x)',
    '!**/.stryker-tmp/**/*.[jt]s?(x)',
  ],
  coverageThreshold: {},
  modulePathIgnorePatterns: ['<rootDir>/.stryker-tmp'],
  setupFilesAfterEnv: ['./tests/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePaths: ['<rootDir>'],
};
