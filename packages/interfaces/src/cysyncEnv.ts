export interface ICysyncEnv {
  LOG_LEVEL: string;
  BUILD_TYPE: string;
  API_CYPHEROCK: string;
  BUILD_VERSION: string;
  IS_PRODUCTION: string;
  IS_TEST: string;
  USER_DATA_PATH: string;
  ALLOW_PRERELEASE: string;
  VERSION: string;
  CHANNEL: string;
  RELEASE_NOTES: string;
  OS: 'darwin' | 'win32' | 'linux' | string;
}
