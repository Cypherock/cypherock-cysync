import {
  BlurOverlay,
  CloseButton,
  DialogBoxBackgroundBar,
  DialogBoxBody,
  WalletDialogMainContainer,
} from '@cypherock/cysync-ui';
import { DialogBox } from '@cypherock/cysync-ui/src';
import React, { FC } from 'react';

import { SignMessageDialogProvider, useSignMessageDialog } from './context';

const SignMessage: FC = () => {
  const { currentDialog, tabs, currentTab, onClose } = useSignMessageDialog();

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0}>
        <WalletDialogMainContainer>
          <DialogBoxBody
            p={0}
            grow={2}
            align="center"
            gap={110}
            direction="column"
            height="full"
          >
            <DialogBox width={500}>
              <DialogBoxBody p="0" gap={0}>
                {tabs[currentTab]?.dialogs[currentDialog]}
              </DialogBoxBody>
            </DialogBox>
          </DialogBoxBody>

          <DialogBoxBackgroundBar
            rightComponent={<CloseButton onClick={onClose} />}
            position="top"
            useLightPadding
          />
        </WalletDialogMainContainer>
      </DialogBox>
    </BlurOverlay>
  );
};

export const SignMessageDialog: FC = () => (
  <SignMessageDialogProvider>
    <SignMessage />
  </SignMessageDialogProvider>
);
