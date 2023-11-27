import { app, BrowserWindow, screen, shell } from 'electron';

import { config } from './config';
import { windowUrls } from './urls';

const MIN_SCREEN_WIDTH = 1440;
const MIN_SCREEN_HEIGHT = 900;

export const getAppWindowSize = (isLoadingWindow = false) => {
  if (isLoadingWindow) {
    return {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
    };
  }

  const widthRatio = 256;
  const heightRatio = 175;

  const MIN_REDUCTION_FACTOR = 0.7;
  const MAX_REDUCTION_FACTOR = 1;

  const { width: deviceWidth, height: deviceHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  const minHeight = Math.min(MIN_SCREEN_HEIGHT, deviceHeight);
  const minWidth = Math.min(MIN_SCREEN_WIDTH, deviceWidth);

  const isMinScreen =
    deviceWidth <= MIN_SCREEN_WIDTH || deviceHeight <= MIN_SCREEN_HEIGHT;

  // Calculate the optimal reduction factor for the window size
  const reductionFactor = Math.max(
    Math.min(minWidth / deviceWidth, MAX_REDUCTION_FACTOR),
    MIN_REDUCTION_FACTOR,
  );

  // Calculate the new window sizes
  let newWidth = deviceWidth * reductionFactor;
  let newHeight = Math.min((newWidth * heightRatio) / widthRatio, deviceHeight);

  newHeight = Math.max(newHeight, minHeight);
  newWidth = Math.max(newWidth, minWidth);

  return {
    width: Math.floor(newWidth),
    height: Math.floor(newHeight),
    minWidth,
    minHeight,
    showFullscreen: isMinScreen,
  };
};

export const fadeInWindow = (
  win?: BrowserWindow,
  totalSteps = 20.0,
  totalTime = 200.0,
) => {
  let currentOpacity = win?.getOpacity() ?? 0;

  const timerID = setInterval(() => {
    if (!win || win.isDestroyed()) {
      clearInterval(timerID);
      return;
    }

    currentOpacity += 1.0 / totalSteps;
    win.setOpacity(currentOpacity);
    if (currentOpacity > 1.0) {
      clearInterval(timerID);
    }
  }, totalTime / totalSteps);
};

export const createWindowAndOpenUrl = (
  url: string,
  isLoadingWindow = false,
) => {
  const { width, height, minWidth, minHeight, showFullscreen } =
    getAppWindowSize(isLoadingWindow);

  const win = new BrowserWindow({
    show: false,
    frame: !isLoadingWindow,
    opacity: 0,
    width,
    height,
    minWidth,
    minHeight,
    resizable: !isLoadingWindow,
    minimizable: true,
    maximizable: !isLoadingWindow,
    autoHideMenuBar: true,
    title: app.getName(),
    icon: windowUrls.iconPath,
    webPreferences: {
      preload: windowUrls.preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (url.startsWith('http')) {
    win.loadURL(url);

    if (!config.IS_PRODUCTION && !config.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    win.loadFile(url);
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url: urlToOpen }) => {
    if (url.startsWith('https:')) shell.openExternal(urlToOpen);
    return { action: 'deny' };
  });

  const isMacOS = process.platform === 'darwin';

  // Only show full screen on macos
  return { win, showFullscreen: isMacOS && showFullscreen };
};
