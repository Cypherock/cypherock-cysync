import axios from 'axios';
import { config } from '../config';
import * as uuid from 'uuid';

export const sendFeedback = async (
  email: string,
  category: string,
  description: string,
) => {
  await axios.post(`${config.API_CYPHEROCK}/feedback`, {
    subject: category,
    category,
    email,
    description,
    systemInfo: undefined,
    deviceInfo: undefined,
    deviceLogs: [],
    desktopLogs: [],
    uuid: uuid.v4(),
    appVersion: window.cysyncEnv.VERSION,
  });

  return true;
};
