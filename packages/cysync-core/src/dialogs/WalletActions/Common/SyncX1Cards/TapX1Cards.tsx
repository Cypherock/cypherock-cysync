import { syncX1Cards, GuidedFlowDialogBox } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import { selectLanguage, useAppSelector } from '~/store';

export const TapX1Cards: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={syncX1Cards}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.walletActions.common.syncX1Cards.heading}
      title={lang.strings.walletActions.common.syncX1Cards.title}
      subTitle={lang.strings.walletActions.common.syncX1Cards.subTitle}
      goldenArrowList={lang.strings.walletActions.common.syncX1Cards.list}
    />
  );
};
