import {
  CreateWalletDialogBoxLayout,
  ConfettiBlast,
  successIcon,
  Container,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

export const SuccessMessage: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ state, setState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <>
      <CreateWalletDialogBoxLayout
        heading={
          lang.strings.onboarding.createWallet.walletCreationSuccess.heading
        }
        title={
          lang.strings.onboarding.createWallet.walletCreationSuccess.titles
            .first
        }
        state={state}
        setState={setState}
        image={successIcon}
      />
      <Container position="absolute">
        <ConfettiBlast />
      </Container>
    </>
  );
};
