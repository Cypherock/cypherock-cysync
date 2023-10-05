import axios from 'axios';

import { getUUID } from '~/utils';

import { config } from '../config';

export const sendFeedback = async (
  email: string,
  category: string,
  description: string,
) => {
  const id = await getUUID();
  await axios.post(`${config.API_CYPHEROCK}/feedback`, {
    subject: category,
    category,
    email,
    description,
    systemInfo: undefined,
    deviceInfo: undefined,
    deviceLogs: [],
    desktopLogs: [],
    uuid: id,
    appVersion: window.cysyncEnv.VERSION,
  });

  return true;
};
