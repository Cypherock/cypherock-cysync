import { confirmPin, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const ConfirmPin: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={confirmPin}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.walletActions.common.device.confirmPin.heading}
      isLoading
      loadingText={lang.strings.walletActions.common.device.confirmPin.loading}
      title={lang.strings.walletActions.common.device.confirmPin.title}
      bulletList={lang.strings.walletActions.common.device.confirmPin.list}
    />
  );
};
