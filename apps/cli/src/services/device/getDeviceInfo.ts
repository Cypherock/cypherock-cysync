import { ManagerApp } from '@cypherock/sdk-app-manager';
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

export const getDeviceInfo = async (app: ManagerApp) => {
  const info = await app.getDeviceInfo();
  return {
    ...info,
    deviceSerial: uint8ArrayToHex(info.deviceSerial),
  };
};
