export interface UpdateInfo {
  /**
   * The version.
   */
  readonly version: string;
  /**
   * The release name.
   */
  releaseName?: string | null;
  /**
   * The release notes. List if `updater.fullChangelog` is set to `true`, `string` otherwise.
   */
  releaseNotes?: string | string[] | null;
  /**
   * The release date.
   */
  releaseDate: string;
}

export type OnUpdateDownloadProgress = (percent: number) => void;

export type OnUpdateDownloaded = (updateInfo: UpdateInfo) => void;

export type OnUpdateError = (error: Error) => void;

export type AddUpdateDownloadProgressListener = (
  listener: OnUpdateDownloadProgress,
) => void;

export type AddUpdateDownloadCompleteListener = (
  listener: OnUpdateDownloaded,
) => void;

export type AddUpdateDownloadErrorListener = (listener: OnUpdateError) => void;

export type RemoveUpdateDownloadListeners = () => Promise<void>;

export type CheckForUpdates = () => Promise<UpdateInfo | undefined>;

export type DownloadUpdate = () => Promise<void>;

export type InstallUpdate = () => Promise<void>;

export interface AutoUpdater {
  checkForUpdates: CheckForUpdates;
  downloadUpdate: DownloadUpdate;
  installUpdate: InstallUpdate;
  addUpdateProgressListener: AddUpdateDownloadProgressListener;
  addUpdateCompletedListener: AddUpdateDownloadCompleteListener;
  addUpdateErrorListener: AddUpdateDownloadErrorListener;
  removeUpdateListeners: RemoveUpdateDownloadListeners;
}
