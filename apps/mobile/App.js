import 'react-native-get-random-values';
import 'node-libs-react-native/globals';
import { randomBytes } from 'react-native-randombytes';

if (__DEV__) {
  process.env = { ...process.env, NODE_ENV: 'development' };
} else {
  process.env = { ...process.env, NODE_ENV: 'production' };
}

// polyfill for random bytes
if (!global.crypto) {
  global.crypto = {
    getRandomValues: buffer => randomBytes(buffer.length).copy(buffer),
  };
}

import 'expo-router/entry';
