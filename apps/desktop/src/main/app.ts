import { release } from 'node:os';
import path from 'node:path';

import { sleep } from '@cypherock/cysync-utils';
import { app, BrowserWindow, ipcMain, shell } from 'electron';

import { removeListeners, setupIPCHandlers, setupListeners } from './ipc';
import { getSendWCConnectionString } from './ipc/walletConnect';
import {
  addAppHooks,
  config,
  createWindowAndOpenUrl,
  fadeInWindow,
  initializeAndGetDb,
  installDeveloperExtensions,
  logger,
  migrateDbBetweenChannels,
  setupProcessEventHandlers,
  setWCUri,
  windowUrls,
} from './utils';
import { autoUpdater } from './utils/autoUpdater';
import { setupDependencies } from './utils/dependencies';

const LOADING_WINDOW_MIN_DISPLAY_TIME_IN_MS = 2 * 1000;
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
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('cypherock', process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient('cypherock');
  }

  setupProcessEventHandlers();
  setupDependencies();
  setupIPCHandlers(ipcMain, getWebContents);

  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1')) app.disableHardwareAcceleration();

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32') app.setAppUserModelId(app.getName());
};

const setupIntitialState = async () => {
  await migrateDbBetweenChannels();
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
  let loadingWindowOpenedAt: number = Date.now();

  const createMainWindow = async () => {
    logger.debug('Starting main window');
    const mw = createWindowAndOpenUrl(windowUrls.mainWindowUrl);
    mainWindow = mw.win;

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

    mainWindow.once('ready-to-show', async () => {
      logger.info('Main Window loaded');
      if (!mainWindow || mainWindow.isDestroyed()) {
        return;
      }

      const timeLeftForLoadingWindow =
        LOADING_WINDOW_MIN_DISPLAY_TIME_IN_MS +
        (Date.now() - loadingWindowOpenedAt);

      if (timeLeftForLoadingWindow > 0) {
        await sleep(timeLeftForLoadingWindow);
      }

      mainWindow.show();
      fadeInWindow(mainWindow);

      if (loadingWindow && !loadingWindow.isDestroyed()) {
        loadingWindow.hide();
        loadingWindow.destroy();
      }
    });

    mainWindow.once('show', () => {
      if (mw.showFullscreen && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setFullScreen(true);
      }
    });

    mainWindow.on('enter-full-screen', () => {
      if (mw.showFullscreen && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setFullScreenable(false);
      }
    });
  };

  const createLoadingWindow = () => {
    logger.debug('Starting loading window');
    const lw = createWindowAndOpenUrl(windowUrls.loadingWindowUrl, true);
    loadingWindow = lw.win;

    loadingWindow.once('ready-to-show', async () => {
      logger.debug('Loading window loaded');
      if (loadingWindow && !loadingWindow.isDestroyed()) {
        loadingWindow.show();
        fadeInWindow(loadingWindow);
        loadingWindowOpenedAt = Date.now();

        await setupIntitialState();
        await createMainWindow();
      }
    });
  };

  const handleUriOpen = async (uri: string) => {
    logger.info('Deep link uri', { uri });
    try {
      const newUrl = uri.startsWith('cypherock://')
        ? uri
        : `cypherock://${uri}`;
      const url = new URL(newUrl);

      // Handle wallet connect open
      if (url.host === 'wc') {
        const connectionString = url.searchParams.get('uri');

        if (connectionString && mainWindow && !mainWindow.isDestroyed()) {
          getSendWCConnectionString()(connectionString);
        }
        setWCUri(connectionString ?? undefined);
      }
    } catch (error) {
      logger.error('Error in handling URL');
      logger.error(error);
    }
  };

  app.whenReady().then(createLoadingWindow);

  app.on('window-all-closed', () => {
    mainWindow = null;
    app.quit();
  });

  app.on('second-instance', (_event, argv, workingDirectory) => {
    // Handle Deep-link for windows
    logger.info('Second instance opened', {
      commandLine: argv,
      workingDirectory,
    });

    if (
      argv.length > 1 &&
      (process.platform === 'win32' || process.platform === 'linux')
    ) {
      try {
        handleUriOpen(argv[argv.length - 1].split('cypherock://')[1]);
      } catch {
        logger.error(`Direct link to file - FAILED: ${argv}`);
      }
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('open-url', (event, url) => {
    // Handle deeplink for macos
    logger.info('Deeplink received');
    logger.info({ event, url });
    event.preventDefault();
    mainWindow?.show();

    handleUriOpen(url);
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
