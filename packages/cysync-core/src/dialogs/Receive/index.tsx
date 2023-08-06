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

import { ReceiveDialogProvider, useReceiveDialog } from './context';
import { selectLanguage, useAppSelector } from '~/store';

export const Receive: FC = () => {
  const { tabs, currentTab, currentDialog, onClose } = useReceiveDialog();
  const lang = useAppSelector(selectLanguage);

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        <>
          <MilestoneAside
            milestones={tabs.map(t => t.name)}
            activeTab={currentTab}
            heading={lang.strings.receive.header}
          />
          <WalletDialogMainContainer>
            <Container width="full" p={2} justify="flex-end">
              <CloseButton onClick={onClose} />
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

export const ReceiveDialog: FC = () => (
  <ReceiveDialogProvider>
    <Receive />
  </ReceiveDialogProvider>
);
