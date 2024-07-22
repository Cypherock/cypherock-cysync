import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { closeDialog, useAppDispatch } from '~/store';

export interface ReleaseNotesDialogContextInterface {
  onClose: () => void;
}

export const ReleaseNotesDialogContext: Context<ReleaseNotesDialogContextInterface> =
  createContext<ReleaseNotesDialogContextInterface>(
    {} as ReleaseNotesDialogContextInterface,
  );

export interface ReleaseNotesDialogProviderProps {
  children: ReactNode;
}

export const ReleaseNotesDialogProvider: FC<
  ReleaseNotesDialogProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeDialog('releaseNotes'));
  };

  const ctx = useMemo(
    () => ({
      onClose,
    }),
    [onClose],
  );

  return (
    <ReleaseNotesDialogContext.Provider value={ctx}>
      {children}
    </ReleaseNotesDialogContext.Provider>
  );
};

export function useReleaseNotesDialog(): ReleaseNotesDialogContextInterface {
  return useContext(ReleaseNotesDialogContext);
}
