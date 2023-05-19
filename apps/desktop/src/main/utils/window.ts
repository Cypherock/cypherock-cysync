import { app, BrowserWindow, screen, shell } from 'electron';
import { config } from './config';
import { windowUrls } from './urls';

export const getAppWindowSize = (isLoadingWindow = false) => {
  if (isLoadingWindow) {
    return {
      width: 600,
      height: 400,
      minWidth: 600,
      minHeight: 400,
    };
  }

  const widthRatio = 256;
  const heightRatio = 175;

  const MIN_REDUCTION_FACTOR = 0.7;
  const MAX_REDUCTION_FACTOR = 1;

  let minHeight = 700;
  let minWidth = 1024;

  const { width: deviceWidth, height: deviceHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  let newHeight = 0;
  let newWidth = 0;

  // Calculate the optimal reduction factor for the window size
  const reductionFactor = Math.max(
    Math.min(minWidth / deviceWidth, MAX_REDUCTION_FACTOR),
    MIN_REDUCTION_FACTOR,
  );

  // Calculate the new window sizes
  newWidth = deviceWidth * reductionFactor;
  newHeight = (newWidth * heightRatio) / widthRatio;

  // When only the calculated height is bigger than the device height
  if (newHeight > deviceHeight) {
    newHeight = deviceHeight;
    minHeight = deviceHeight;
  }

  // When the calculated width cant be accomodated
  if (newWidth < minWidth) {
    newWidth = deviceWidth;
    minWidth = newWidth;
  }

  // When the calculated height cant be accomodated
  if (newHeight < minHeight) {
    newHeight = minHeight;
    minHeight = newHeight;
  }

  return {
    width: Math.floor(newWidth),
    height: Math.floor(newHeight),
    minWidth,
    minHeight,
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
  const { width, height, minWidth, minHeight } =
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

  return win;
};
