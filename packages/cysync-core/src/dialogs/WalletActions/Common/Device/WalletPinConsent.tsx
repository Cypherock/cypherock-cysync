import { GuidedFlowDialogBox, pinDeviceConsent } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletPinConsent: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={pinDeviceConsent}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.walletActions.common.device.setupPinConsent.heading}
      title={lang.strings.walletActions.common.device.setupPinConsent.title}
      subTitle={
        lang.strings.walletActions.common.device.setupPinConsent.subTitle
      }
    />
  );
};
