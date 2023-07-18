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

import { ReceiveGuideProvider, useReceiveGuide } from './context';

import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

export const Receive: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { tabs, currentTab, currentDialog } = useReceiveGuide();
  const dispatch = useAppDispatch();

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        <>
          <MilestoneAside
            milestones={tabs.map(t => t.name)}
            activeTab={currentTab}
          />
          <WalletDialogMainContainer>
            <Container width="full" p={2} justify="space-between">
              <HelpButton text={lang.strings.help} />
              <CloseButton
                onClick={() => dispatch(closeDialog('receiveGuide'))}
              />
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

export const ReceiveGuide: FC = () => (
  <ReceiveGuideProvider>
    <Receive />
  </ReceiveGuideProvider>
);
