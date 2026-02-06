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

if (__DEV__) {
  process.env = { ...process.env, NODE_ENV: 'development' };
} else {
  process.env = { ...process.env, NODE_ENV: 'production' };
}
