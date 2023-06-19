import { UpdateInfo } from '@cypherock/cysync-interfaces';
import { WebContents } from 'electron';
import {
  autoUpdater as electronAutoUpdater,
  CancellationToken,
  UpdateDownloadedEvent,
} from 'electron-updater';
import { ipcConfig } from '../ipc/helpers/config';
import { config } from './config';
import { createServiceLogger } from './logger';

class AutoUpdater {
  private cancellationToken?: CancellationToken;

  private isUpdateAvailable?: boolean;

  private downloadedInfo?: UpdateInfo;

  private webContents?: WebContents;

  constructor() {
    if (config.IS_TEST) {
      return;
    }

    electronAutoUpdater.logger = createServiceLogger('autoUpdater');
    electronAutoUpdater.autoDownload = false;
  }

  public setup(webContents: WebContents) {
    if (config.IS_TEST) {
      return;
    }

    this.webContents = webContents;

    electronAutoUpdater.signals.progress(e => {
      this.onProgress(e.percent);
    });
    electronAutoUpdater.signals.updateDownloaded(e => {
      this.onComplete(e);
    });
    electronAutoUpdater.on('error', e => {
      this.onError(e);
    });
  }

  public async checkForUpdates(): Promise<UpdateInfo | undefined> {
    const update = await electronAutoUpdater.checkForUpdates();

    if (update) {
      this.isUpdateAvailable = true;
      return update.updateInfo;
    }

    this.isUpdateAvailable = false;
    return undefined;
  }

  public async downloadUpdate() {
    if (!this.isUpdateAvailable) throw new Error('Update not available');

    if (this.downloadedInfo) {
      this.onComplete(this.downloadedInfo);
      return;
    }

    if (this.cancellationToken) {
      this.cancellationToken.cancel();
      this.cancellationToken = undefined;
    }

    this.cancellationToken = new CancellationToken();

    await electronAutoUpdater.downloadUpdate(this.cancellationToken);
  }

  // eslint-disable-next-line class-methods-use-this
  public async installUpdate() {
    electronAutoUpdater.quitAndInstall();
  }

  private onProgress(percent: number) {
    if (this.webContents) {
      this.webContents.send(
        ipcConfig.listeners.downloadUpdateProgress,
        percent,
      );
    }
  }

  private onComplete(info: UpdateDownloadedEvent | UpdateInfo) {
    this.downloadedInfo = info;

    if (this.webContents) {
      this.webContents.send(
        ipcConfig.listeners.downloadUpdateCompleted,
        this.downloadedInfo,
      );
    }
  }

  private onError(error: Error) {
    if (this.webContents) {
      this.webContents.send(ipcConfig.listeners.downloadUpdateError, error);
    }
  }
}

export const autoUpdater = new AutoUpdater();
