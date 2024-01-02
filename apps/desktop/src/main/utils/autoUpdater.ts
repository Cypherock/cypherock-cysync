import { UpdateInfo } from '@cypherock/cysync-interfaces';
import { WebContents } from 'electron';
import {
  autoUpdater as electronAutoUpdater,
  CancellationToken,
  UpdateDownloadedEvent,
  UpdateInfo as ElectronUpdateInfo,
} from 'electron-updater';

import { config } from './config';
import { createServiceLogger } from './logger';

import { ipcConfig } from '../ipc/helpers/config';

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
    electronAutoUpdater.channel = config.CHANNEL;
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

    if (update && update.versionInfo.version !== config.VERSION) {
      this.isUpdateAvailable = true;
      return this.parseUpdateInfo(update.updateInfo);
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
    electronAutoUpdater.quitAndInstall(true, true);
  }

  // eslint-disable-next-line class-methods-use-this
  private parseUpdateInfo(info: ElectronUpdateInfo | UpdateInfo): UpdateInfo {
    let releaseNotes: UpdateInfo['releaseNotes'];

    if (info.releaseNotes && Array.isArray(info.releaseNotes)) {
      releaseNotes = info.releaseNotes.map(note =>
        typeof note === 'string' ? note : note.note ?? '',
      );
    } else {
      releaseNotes = info.releaseNotes;
    }

    return {
      ...info,
      releaseNotes,
    };
  }

  private getWebContents() {
    if (this.webContents && !this.webContents.isDestroyed()) {
      return this.webContents;
    }

    return undefined;
  }

  private onProgress(percent: number) {
    const webContents = this.getWebContents();
    if (webContents) {
      webContents.send(
        ipcConfig.listeners.downloadUpdateProgress,
        Number(percent.toFixed(0)),
      );
    }
  }

  private onComplete(info: UpdateDownloadedEvent | UpdateInfo) {
    this.downloadedInfo = this.parseUpdateInfo(info);

    const webContents = this.getWebContents();
    if (webContents) {
      webContents.send(ipcConfig.listeners.downloadUpdateProgress, Number(100));
      webContents.send(
        ipcConfig.listeners.downloadUpdateCompleted,
        this.downloadedInfo,
      );
    }
  }

  private onError(error: Error) {
    const webContents = this.getWebContents();
    if (webContents) {
      webContents.send(ipcConfig.listeners.downloadUpdateError, error);
    }
  }
}

export const autoUpdater = new AutoUpdater();
