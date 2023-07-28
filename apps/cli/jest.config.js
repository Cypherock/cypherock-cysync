const baseConfig = require('@cypherock/jest-config/node');

module.exports = {
  ...baseConfig,
  testTimeout: 60 * 1000,
};
