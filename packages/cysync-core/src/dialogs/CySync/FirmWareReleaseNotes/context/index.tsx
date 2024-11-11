import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { closeDialog, useAppDispatch } from '~/store';

export interface FirmwareReleaseNotesDialogContextInterface {
  onClose: () => void;
}

export const FirmwareReleaseNotesDialogContext: Context<FirmwareReleaseNotesDialogContextInterface> =
  createContext<FirmwareReleaseNotesDialogContextInterface>(
    {} as FirmwareReleaseNotesDialogContextInterface,
  );

export interface FirmwareReleaseNotesDialogProviderProps {
  children: ReactNode;
}

export const FirmwareReleaseNotesDialogProvider: FC<
  FirmwareReleaseNotesDialogProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeDialog('firmwareReleaseNotes'));
  };

  const ctx = useMemo(
    () => ({
      onClose,
    }),
    [onClose],
  );

  return (
    <FirmwareReleaseNotesDialogContext.Provider value={ctx}>
      {children}
    </FirmwareReleaseNotesDialogContext.Provider>
  );
};

export function useFirmwareReleaseNotesDialog(): FirmwareReleaseNotesDialogContextInterface {
  return useContext(FirmwareReleaseNotesDialogContext);
}
