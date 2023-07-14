import {
  DialogBox,
  DialogBoxBody,
  HelpButton,
  Container,
  WalletDialogMainContainer,
  MilestoneAside,
  CloseButton,
  BlurOverlay,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';
import { AddAccountGuideProvider, useAddAccountGuide } from './context';

import { CloseConfirmation } from '../CreateWalletGuide/Dialogs';

export const AddNewAccount: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { tabs, currentTab, currentDialog } = useAddAccountGuide();
  const [showOnClose, setShowOnClose] = React.useState(false);

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        {showOnClose && <CloseConfirmation setShowOnClose={setShowOnClose} />}
        <>
          <MilestoneAside
            milestones={tabs.map(t => t.name)}
            activeTab={currentTab}
          />
          <WalletDialogMainContainer>
            <Container width="full" p={2} justify="space-between">
              <HelpButton text={lang.strings.help} />
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

export const AddAccountGuide: FC = () => (
  <AddAccountGuideProvider>
    <AddNewAccount />
  </AddAccountGuideProvider>
);
