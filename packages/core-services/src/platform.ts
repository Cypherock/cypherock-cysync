export type Platform = 'react-native' | 'electron' | 'web';

let currentPlatform: Platform = 'web';

export const configurePlatform = (platform: Platform) => {
  currentPlatform = platform;
};

export const getPlatform = () => currentPlatform;

export const isReactNative = () => currentPlatform === 'react-native';

export const isElectron = () => currentPlatform === 'electron';
