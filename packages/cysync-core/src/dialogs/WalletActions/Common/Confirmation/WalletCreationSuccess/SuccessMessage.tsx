import {
  GuidedFlowDialogBox,
  ConfettiBlast,
  successIcon,
  Container,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const SuccessMessage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <>
      <GuidedFlowDialogBox
        image={successIcon}
        onNext={onNext}
        onPrevious={onPrevious}
        heading={
          lang.strings.walletActions.common.confirmation.walletCreationSuccess
            .heading
        }
        title={
          lang.strings.walletActions.common.confirmation.walletCreationSuccess
            .titles.first
        }
      />
      <Container position="absolute">
        <ConfettiBlast />
      </Container>
    </>
  );
};
