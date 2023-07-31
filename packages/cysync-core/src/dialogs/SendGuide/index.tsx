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

import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { SendGuideProvider, useSendGuide } from './context';

export const SendFlow: FC = () => {
  const { tabs, currentTab, currentDialog } = useSendGuide();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        <>
          <MilestoneAside
            milestones={tabs.map(t => t.name)}
            heading={lang.strings.send.aside.tabs.heading}
            activeTab={currentTab}
            currentDialog={currentDialog}
            totalDialogs={tabs[currentTab].dialogs.length}
          />
          <WalletDialogMainContainer>
            <Container width="full" p={2} justify="flex-end">
              <CloseButton onClick={() => dispatch(closeDialog('sendGuide'))} />
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

export const SendGuide: FC = () => (
  <SendGuideProvider>
    <SendFlow />
  </SendGuideProvider>
);
