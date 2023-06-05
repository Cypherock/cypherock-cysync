const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig_cjs.json');

const baseConfig = require('@cypherock/jest-config/browser');

module.exports = {
  ...baseConfig,
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
};
