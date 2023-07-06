import React from 'react';

import { dialogs } from '~/dialogs';
import {
  useAppSelector,
  selectDialogs,
  IDialogState,
  DialogName,
} from '~/store';

const getDialogFromState = (state: IDialogState) => {
  for (const key in state) {
    if ((state as any)[key]) {
      const dialogName = key as DialogName;

      if (!state[dialogName].isOpen) continue;

      const dialogState = state[dialogName];
      const DialogComponent = dialogs[dialogName];

      return <DialogComponent key={dialogName} {...dialogState.data} />;
    }
  }

  return null;
};

export const DialogManager = () => {
  const dialogState = useAppSelector(selectDialogs);
  const dialog = getDialogFromState(dialogState);

  return dialog;
};
