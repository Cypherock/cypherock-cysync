const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [monorepoRoot];

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('react-native-quick-crypto'),
  buffer: require.resolve('buffer'),
  assert: require.resolve('assert'),
  http: require.resolve('stream-http'),
  https: require.resolve('https-browserify'),
  os: require.resolve('os-browserify/browser'),
  path: require.resolve('path-browserify'),
  stream: require.resolve('readable-stream'),
  url: require.resolve('url'),
  vm: require.resolve('vm-browserify'),
};

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Exclude Electron binaries and desktop app artifacts from Metro's file map
config.resolver.blockList = exclusionList([
  /[\\/]apps[\\/]desktop[\\/].*/,
  /[\\/]node_modules[\\/]electron[\\/].*/,
  /[\\/](?:android|ios)[\\/]build[\\/].*/,
]);

config.transformer.getTransformOptions = () => ({
  transform: {
    inlineRequires: true,
  },
});

module.exports = config;
