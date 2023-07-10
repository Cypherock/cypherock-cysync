import { GuidedFlowDialogBox, informationIcon } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const CreateNewWalletCardSafety: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={informationIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.walletActions.common.confirmation.finalMessage.cardSafety
          .heading
      }
      title={
        lang.strings.walletActions.common.confirmation.finalMessage.cardSafety
          .title
      }
      showInfoIcon={false}
      infoTextVariant="warn"
      infoText={
        lang.strings.walletActions.common.confirmation.finalMessage.cardSafety
          .note
      }
    />
  );
};
