import {
  DialogBox,
  DialogBoxBody,
  Container,
  WalletDialogMainContainer,
  MilestoneAside,
  CloseButton,
  BlurOverlay,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { AddAccountDialogProvider, useAddAccountDialog } from './context';

import { useCloseDialogBox } from '../../hooks/closeDialogBox';

export const AddNewAccount: FC = () => {
  const { tabs, currentTab, currentDialog } = useAddAccountDialog();
  const closeDialogBox = useCloseDialogBox();

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        <>
          <MilestoneAside
            milestones={tabs.map(t => t.name)}
            activeTab={currentTab}
            currentDialog={currentDialog}
            totalDialogs={tabs[currentTab].dialogs.length}
            header={tabs[0].header}
          />
          <WalletDialogMainContainer>
            <Container width="full" p={2} justify="flex-end">
              <CloseButton onClick={() => closeDialogBox('addAccountDialog')} />
            </Container>
            <DialogBoxBody
              p="20"
              grow={2}
              align="center"
              gap={110}
              direction="column"
              height="full"
            >
              {tabs[currentTab]?.dialogs[currentDialog]}
            </DialogBoxBody>
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const AddAccountDialog: FC = () => (
  <AddAccountDialogProvider>
    <AddNewAccount />
  </AddAccountDialogProvider>
);
