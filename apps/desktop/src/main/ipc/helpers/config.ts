export const ipcConfig = {
  methods: {
    logWithServiceAndLevel: 'logger:logWithServiceAndLevel',
    getDevices: 'device:list',
    connectDevice: 'device:connect',
    connectedDeviceMethodCall: 'device:method:call',
    dbMethodCall: 'db:method:call',
    dbMethodList: 'db:method:list',
  },
  env: [
    'LOG_LEVEL',
    'BUILD_TYPE',
    'API_CYPHEROCK',
    'BUILD_VERSION',
    'IS_PRODUCTION',
    'IS_TEST',
    'ALLOW_PRERELEASE',
    'USER_DATA_PATH',
  ],
};
