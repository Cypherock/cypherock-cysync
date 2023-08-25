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

import { selectLanguage, useAppSelector } from '~/store';

import { SendDialogProvider, useSendDialog } from './context';
import { CloseConfirmation } from './Dialogs';

export const SendFlow: FC = () => {
  const { tabs, currentTab, currentDialog } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const [showOnClose, setShowOnClose] = React.useState(false);

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        {showOnClose && <CloseConfirmation setShowOnClose={setShowOnClose} />}
        <>
          <MilestoneAside
            milestones={tabs.map(t => t.name)}
            heading={lang.strings.send.aside.tabs.heading}
            activeTab={currentTab}
          />
          <WalletDialogMainContainer>
            <Container width="full" p={2} justify="flex-end">
              <CloseButton onClick={() => setShowOnClose(true)} />
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

export const SendDialog: FC = () => (
  <SendDialogProvider>
    <SendFlow />
  </SendDialogProvider>
);
