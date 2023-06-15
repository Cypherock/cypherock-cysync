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
import { DeviceTab } from './Tabs/DeviceTab';

export const CreateNewWallet: FC<{
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowCreateWalletDialogBox }) => {
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = useState<number>(0);
  return (
    <DialogBox direction="row" gap={0} width="full">
      <WalletDialogAside
        tabs={lang.strings.onboarding.createWallet.aside.tabs}
        state={state}
      />
      <WalletDialogMainContainer>
        <Container width="full" p={2} justify="space-between">
          <HelpHeader text={lang.strings.help} />
          <CloseButton onClick={() => setShowCreateWalletDialogBox(false)} />
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
            </DialogBoxBody>
          </DialogBox>
        </DialogBoxBody>
      </WalletDialogMainContainer>
    </DialogBox>
  );
};
