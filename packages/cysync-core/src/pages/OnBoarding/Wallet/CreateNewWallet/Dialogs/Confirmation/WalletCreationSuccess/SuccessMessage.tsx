import {
  CreateWalletDialogBoxLayout,
  ConfettiBlast,
  successIcon,
  Container,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const SuccessMessage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <>
      <CreateWalletDialogBoxLayout
        image={successIcon}
        onNext={onNext}
        onPrevious={onPrevious}
        heading={
          lang.strings.onboarding.createWallet.walletCreationSuccess.heading
        }
        title={
          lang.strings.onboarding.createWallet.walletCreationSuccess.titles
            .first
        }
      />
      <Container position="absolute">
        <ConfettiBlast />
      </Container>
    </>
  );
};
