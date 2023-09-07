import { BlurOverlay } from '@cypherock/cysync-ui';
import { DialogBox } from '@cypherock/cysync-ui/src';
import React, { FC } from 'react';

import { SignMessageDialogProvider, useSignMessageDialog } from './context';

const SignMessage: FC = () => {
  const { currentDialog, tabs, currentTab } = useSignMessageDialog();

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} align="center">
        {tabs[currentTab]?.dialogs[currentDialog]}
      </DialogBox>
    </BlurOverlay>
  );
};

export const SignMessageDialog: FC = () => (
  <SignMessageDialogProvider>
    <SignMessage />
  </SignMessageDialogProvider>
);
