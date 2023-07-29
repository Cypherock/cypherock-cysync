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

import { CreateWalletGuideProvider, useCreateWalletGuide } from './context';

export const CreateNewWallet: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { tabs, currentTab, currentDialog } = useCreateWalletGuide();
  const [showOnClose, setShowOnClose] = React.useState(false);

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        {showOnClose && <div>test</div>}
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
              <DialogBox width={500}>
                <DialogBoxBody p="0" gap={0}>
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </DialogBoxBody>
              </DialogBox>
            </DialogBoxBody>
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const CreateWalletGuide: FC = () => (
  <CreateWalletGuideProvider>
    <CreateNewWallet />
  </CreateWalletGuideProvider>
);
