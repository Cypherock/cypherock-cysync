import axios from 'axios';

import { getUUID } from '~/utils';

import { config } from '../config';

export const sendFeedback = async (params: {
  email: string;
  category: string;
  description: string;
  desktopLogs: string[];
  deviceLogs: string[];
  systemInfo: any;
  deviceInfo: any;
}) => {
  const id = await getUUID();
  await axios.post(`${config.API_CYPHEROCK}/feedback`, {
    ...params,
    subject: params.category,
    uuid: id,
    appVersion: window.cysyncEnv.VERSION,
  });

  return true;
};
