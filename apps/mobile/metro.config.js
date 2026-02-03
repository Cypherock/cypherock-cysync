const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [...config.watchFolders, monorepoRoot];

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...require('node-libs-react-native'),
  crypto: require.resolve('react-native-quick-crypto'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'axios') {
    return {
      filePath: require.resolve('axios/dist/browser/axios.cjs'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
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
