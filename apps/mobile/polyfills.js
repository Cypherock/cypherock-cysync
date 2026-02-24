import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import * as crypto from 'react-native-quick-crypto';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}
if (typeof global.crypto === 'undefined') {
  global.crypto = crypto;
}

import 'text-encoding-polyfill';
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';
import mobileConfig from './config';

if (__DEV__) {
  process.env = {
    ...process.env,
    NODE_ENV: 'development',
    API_CYPHEROCK: mobileConfig.API_CYPHEROCK,
  };
} else {
  process.env = {
    ...process.env,
    NODE_ENV: 'production',
    API_CYPHEROCK: process.env.API_CYPHEROCK || 'https://api.cypherock.com',
  };
}
