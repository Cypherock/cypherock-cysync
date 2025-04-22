const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.extraNodeModules = {
  ...require('node-libs-react-native'),
  crypto: require.resolve('react-native-crypto'),
};
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];
config.transformer.getTransformOptions = () => ({
  transform: {
    inlineRequires: true,
  },
});

module.exports = config;
