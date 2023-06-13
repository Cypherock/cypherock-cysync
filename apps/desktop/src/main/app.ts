import { app, BrowserWindow, ipcMain } from 'electron';
import { release } from 'node:os';
import { setupIPCHandlers } from './ipc';
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

const shouldStartApp = () => {
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

  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1')) app.disableHardwareAcceleration();

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32') app.setAppUserModelId(app.getName());
};

const setupIntitialState = async () => {
  initializeAndGetDb();
  setupIPCHandlers(ipcMain);
};

export default function createApp() {
  if (!shouldStartApp()) {
    app.quit();
    return;
  }

  logger.info('Starting Application', { config });
  prepareApp();

  let mainWindow: BrowserWindow | null = null;
  let loadingWindow: BrowserWindow | null = null;

  const createMainWindow = async () => {
    logger.debug('Starting main window');
    mainWindow = createWindowAndOpenUrl(windowUrls.mainWindowUrl);
    autoUpdater.setup(mainWindow.webContents);
    installDeveloperExtensions(mainWindow);

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
