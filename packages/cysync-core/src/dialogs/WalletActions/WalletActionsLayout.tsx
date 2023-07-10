import {
  Container,
  DialogBox,
  DialogBoxBody,
  HelpButton,
  MilestoneAside,
  CloseButton,
  WalletDialogMainContainer,
  IWalletActionsTabs,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useState } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

import { CloseConfirmation } from './Common';

export const WalletActionsLayout: FC<{ tabs: IWalletActionsTabs }> = ({
  tabs,
}) => {
  const lang = useAppSelector(selectLanguage);
  const { setTabs, currentTab, currentDialogBox } = useWalletActions();
  const [showOnClose, setShowOnClose] = useState<boolean>(false);

  useEffect(() => {
    setTabs(tabs);
  }, []);

  return (
    <DialogBox $isModal direction="row" gap={0} width="full">
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
            <DialogBox width={500}>
              <DialogBoxBody p="0">
                {tabs[currentTab]?.dialogs[currentDialogBox]?.component}
              </DialogBoxBody>
            </DialogBox>
          </DialogBoxBody>
        </WalletDialogMainContainer>
      </>
    </DialogBox>
  );
};
