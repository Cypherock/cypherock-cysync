import pako from 'pako';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ITabs, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';

import { ShowQrCode } from '../Dialogs';

export interface MobileAppSyncDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  getSyncData: () => Promise<string[]>;
  isLoading: boolean;
}

export const MobileAppSyncDialogContext: Context<MobileAppSyncDialogContextInterface> =
  createContext<MobileAppSyncDialogContextInterface>(
    {} as MobileAppSyncDialogContextInterface,
  );

export interface MobileAppSyncDialogProviderProps {
  children: ReactNode;
}

const CHUNK_SIZE = 250;

export const MobileAppSyncDialogProvider: FC<
  MobileAppSyncDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(() => ({}), []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClose = () => {
    dispatch(closeDialog('mobileAppSyncDialog'));
  };

  const chunkData = (data: string, size: number = CHUNK_SIZE) => {
    const delimiter = '|';
    const chunks = [];
    let chunkIndex = 0;
    for (let i = 0; i < data.length; i += size) {
      chunkIndex += 1;
      chunks.push(
        `CHUNK${delimiter}${chunkIndex}${delimiter}${Math.ceil(
          data.length / size,
        )}${delimiter}${data.slice(i, i + size)}`,
      );
    }
    return chunks;
  };

  const getSyncData = useCallback(async () => {
    setIsLoading(true);
    const db = getDB();
    const wallets = await db.wallet.getAll();
    const accounts = await db.account.getAll();
    const data = { wallets, accounts };
    const compressedData = pako.deflate(JSON.stringify(data));
    const base64data = Buffer.from(compressedData).toString('base64');
    const chunks = chunkData(base64data);
    setIsLoading(false);
    return chunks;
  }, []);

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.settings.tabs.app.title,
        dialogs: [<ShowQrCode key="show-qr-code" />],
      },
    ],
    [lang],
  );

  const {
    onNext,
    onPrevious,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
  } = useTabsAndDialogs({
    deviceRequiredDialogsMap,
    tabs,
    dialogName: 'mobileAppSyncDialog',
  });

  const ctx = useMemoReturn({
    isDeviceRequired,
    currentTab,
    currentDialog,
    tabs,
    onNext,
    goTo,
    onPrevious,
    onClose,
    getSyncData,
    isLoading,
  });

  return (
    <MobileAppSyncDialogContext.Provider value={ctx}>
      {children}
    </MobileAppSyncDialogContext.Provider>
  );
};

export function useMobileAppSyncDialog(): MobileAppSyncDialogContextInterface {
  return useContext(MobileAppSyncDialogContext);
}
