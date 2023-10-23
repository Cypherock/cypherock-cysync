const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig_cjs.json');

const baseConfig = require('@cypherock/jest-config/browser');

module.exports = {
  ...baseConfig,
  // Jest fails to collect coverage when using webworker
  collectCoverage: false,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
};
