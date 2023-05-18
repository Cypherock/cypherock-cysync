import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import { setupIPCHandlers } from './ipc';
import { config } from './utils/config';
import logger from './utils/logger';
import { initDb } from './utils/db';

function prepareApp() {
  setupIPCHandlers(ipcMain);
}

export default function createApp() {
  prepareApp();
  logger.info('Starting Application', { config });

  initDb();
  process.env.DIST_ELECTRON = join(__dirname, '../');
  process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
  process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST;

  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1')) app.disableHardwareAcceleration();

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32') app.setAppUserModelId(app.getName());

  if (!app.requestSingleInstanceLock()) {
    app.quit();
    process.exit(0);
  }

  let win: BrowserWindow | null = null;

  const preload = join(__dirname, '../preload/index.js');
  const rendererUrl = process.env.VITE_DEV_SERVER_URL;
  const indexHtml = join(process.env.DIST, 'index.html');
  const icon = process.env.PUBLIC;

  async function createWindow() {
    win = new BrowserWindow({
      title: 'Main window',
      icon: join(icon, 'favicon.ico'),
      webPreferences: {
        preload,
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      if (!rendererUrl) {
        throw new Error('VITE_DEV_SERVER_URL is undefined');
      }

      win.loadURL(rendererUrl);

      if (!config.IS_PRODUCTION && !config.IS_TEST) {
        win.webContents.openDevTools();
      }
    } else {
      win.loadFile(indexHtml);
    }

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url);
      return { action: 'deny' };
    });
  }

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    win = null;
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('second-instance', () => {
    if (win) {
      // Focus on the main window if the user tried to open another
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) {
      allWindows[0].focus();
    } else {
      createWindow();
    }
  });
}
