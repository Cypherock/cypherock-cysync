import { IElectronAPI } from '@cypherock/cysync-interfaces';

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
