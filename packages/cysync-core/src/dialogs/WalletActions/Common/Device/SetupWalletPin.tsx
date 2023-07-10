import { setupPin, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const SetupWalletPin: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={setupPin}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.walletActions.common.device.enterPin.heading}
      title={lang.strings.walletActions.common.device.enterPin.title}
      subTitle={lang.strings.walletActions.common.device.enterPin.subTitle}
      bulletList={lang.strings.walletActions.common.device.enterPin.list}
      infoText={lang.strings.walletActions.common.device.enterPin.note}
      infoTextVariant="muted"
      infoIconVariant="yellow"
    />
  );
};
