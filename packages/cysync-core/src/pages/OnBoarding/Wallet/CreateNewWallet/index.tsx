import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import {
  DialogBox,
  DialogBoxBody,
  HelpHeader,
  Container,
  WalletDialogMainContainer,
  WalletDialogAside,
  CloseButton,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { DeviceTab, SyncX1CardsTab, ConfirmationTab } from './Tabs';
import { OnClose } from './Dialogs/OnClose';

export const CreateNewWallet: FC<{
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
  setShowWalletActionsDialogBox: Dispatch<SetStateAction<boolean>>;
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
  showOnClose: boolean;
}> = ({
  showOnClose,
  setShowCreateWalletDialogBox,
  setShowWalletActionsDialogBox,
  setShowOnClose,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = useState<number>(0);
  return (
    <DialogBox direction="row" gap={0} width="full">
      {showOnClose && (
        <OnClose
          state={state}
          setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
          setShowOnClose={setShowOnClose}
          setState={setState}
        />
      )}
      <>
        <WalletDialogAside
          tabs={lang.strings.onboarding.createWallet.aside.tabs}
          state={state}
        />
        <WalletDialogMainContainer>
          <Container width="full" p={2} justify="space-between">
            <HelpHeader text={lang.strings.help} />
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
                {state <= 5 && <DeviceTab state={state} setState={setState} />}
                {state === 6 && (
                  <SyncX1CardsTab state={state} setState={setState} />
                )}
                {state >= 7 && (
                  <ConfirmationTab
                    state={state}
                    setState={setState}
                    setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
                    setShowWalletActionsDialogBox={
                      setShowWalletActionsDialogBox
                    }
                  />
                )}
              </DialogBoxBody>
            </DialogBox>
          </DialogBoxBody>
        </WalletDialogMainContainer>
      </>
    </DialogBox>
  );
};
