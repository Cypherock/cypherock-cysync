export default {
  /**
   * production: release build
   * debug: testing build
   */
  BUILD_TYPE: 'debug',

  /**
   * Accepted values by priority
   * [
   *  error,
   *  warn,
   *  info,
   *  verbose,
   *  debug,
   * ]
   */
  LOG_LEVEL: 'debug',

  API_CYPHEROCK: 'https://dev-api.cypherock.com',

  /**
   * Should we allow the user to download prerelease firmware?
   */
  ALLOW_PRERELEASE: true,

  /**
   * Simuate production environment even in development mode
   */
  SIMULATE_PRODUCTION: false,

  /**
   * Commit hash of the build
   */
  BUILD_VERSION: 'DEVELOPMENT',

  /**
   * Auto update channel
   */
  CHANNEL: 'latest',
};
