import path from 'node:path';

const mainWindowHtml = path.join('html', 'index.html');
const loadingWindowHtml = path.join('html', 'loading.html');

const getWindowUrls = () => {
  const DIST_ELECTRON = path.join(__dirname, '../');
  const DIST = path.join(DIST_ELECTRON, '../dist');
  const PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(DIST_ELECTRON, '../public')
    : DIST;

  const preload = path.join(__dirname, '../preload/index.js');
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  let mainWindowUrl = path.join(DIST, mainWindowHtml);
  let loadingWindowUrl = path.join(DIST, loadingWindowHtml);

  const iconPath = path.join(PUBLIC, 'icon.png');

  if (devServerUrl) {
    mainWindowUrl = path.join(devServerUrl, mainWindowHtml);
    loadingWindowUrl = path.join(devServerUrl, loadingWindowHtml);
  }

  return {
    isDev: !!devServerUrl,
    preload,
    mainWindowUrl,
    loadingWindowUrl,
    iconPath,
  };
};

export const windowUrls = getWindowUrls();
