const baseConfig = require('@cypherock/jest-config/node');

module.exports = {
  ...baseConfig,
  testTimeout: 10000,
};
