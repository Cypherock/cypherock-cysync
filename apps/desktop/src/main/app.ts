import { release } from 'node:os';

import { app, BrowserWindow, ipcMain, shell } from 'electron';

import { removeListeners, setupIPCHandlers, setupListeners } from './ipc';
import {
  addAppHooks,
  config,
  createWindowAndOpenUrl,
  fadeInWindow,
  initializeAndGetDb,
  installDeveloperExtensions,
  logger,
  setupProcessEventHandlers,
  windowUrls,
} from './utils';
import { autoUpdater } from './utils/autoUpdater';
import { setupDependencies } from './utils/dependencies';

let mainWindow: BrowserWindow | null = null;

const getWebContents = () => {
  if (!mainWindow) {
    throw new Error('Main window not initialized');
  }

  return mainWindow.webContents;
};

const shouldStartApp = () => {
  if (config.IS_E2E) return true;
  // Locks the current application instance.
  const applicationLock = app.requestSingleInstanceLock();

  // If unable to get the lock, then the application is already running.
  if (!applicationLock) {
    logger.info('An instance of CyCync is already running.');
    return false;
  }

  return true;
};

const prepareApp = () => {
  setupProcessEventHandlers();
  setupDependencies();
  setupIPCHandlers(ipcMain, getWebContents);

  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1')) app.disableHardwareAcceleration();

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32') app.setAppUserModelId(app.getName());
};

const setupIntitialState = async () => {
  await initializeAndGetDb();
};

export default function createApp() {
  if (!shouldStartApp()) {
    app.quit();
    return;
  }

  logger.info('Starting Application', { config });
  prepareApp();

  let loadingWindow: BrowserWindow | null = null;

  const createMainWindow = async () => {
    logger.debug('Starting main window');
    mainWindow = createWindowAndOpenUrl(windowUrls.mainWindowUrl);
    setupListeners(mainWindow.webContents);
    autoUpdater.setup(mainWindow.webContents);
    installDeveloperExtensions(mainWindow);

    mainWindow.on('closed', () => {
      removeListeners();
    });

    mainWindow.webContents.setWindowOpenHandler(details => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });

    mainWindow.once('ready-to-show', () => {
      logger.info('Main Window loaded');
      if (!mainWindow || mainWindow.isDestroyed()) {
        return;
      }

      mainWindow.show();
      fadeInWindow(mainWindow);

      if (loadingWindow && !loadingWindow.isDestroyed()) {
        loadingWindow.hide();
        loadingWindow.destroy();
      }
    });
  };

  const createLoadingWindow = () => {
    logger.debug('Starting loading window');
    loadingWindow = createWindowAndOpenUrl(windowUrls.loadingWindowUrl, true);

    loadingWindow.once('ready-to-show', async () => {
      logger.debug('Loading window loaded');
      if (loadingWindow && !loadingWindow.isDestroyed()) {
        loadingWindow.show();
        fadeInWindow(loadingWindow);

        await setupIntitialState();
        await createMainWindow();
      }
    });
  };

  app.whenReady().then(createLoadingWindow);

  app.on('window-all-closed', () => {
    mainWindow = null;
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('second-instance', () => {
    if (mainWindow) {
      // Focus on the main window if the user tried to open another
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      createMainWindow();
    }
  });

  addAppHooks(app);
}
