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
import React, { Dispatch, FC, SetStateAction } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

import { OnClose } from './Dialogs';

export const CreateNewWallet: FC<{
  showOnClose: boolean;
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
}> = ({ showOnClose, setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  const {
    tabs,
    tab,
    dialogBox,
    onNext,
    onPrevious,
    showCreateWalletDialogBox,
    setShowCreateWalletDialogBox,
  } = useCreateNewWallet();

  return showCreateWalletDialogBox ? (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} width="full">
        {showOnClose && (
          <OnClose
            onNext={onNext}
            onPrevious={onPrevious}
            setShowOnClose={setShowOnClose}
            setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
          />
        )}
        <>
          <MilestoneAside milestones={tabs.map(t => t.name)} activeTab={tab} />
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
                  {tabs[tab]?.dialogs[dialogBox]?.component}
                </DialogBoxBody>
              </DialogBox>
            </DialogBoxBody>
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  ) : null;
};
