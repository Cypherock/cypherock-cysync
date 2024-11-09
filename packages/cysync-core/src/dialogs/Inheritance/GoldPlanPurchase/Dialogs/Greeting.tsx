import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../context';

export const Greeting = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceGoldPlanPurchase.checkout.greeting;

  const { onClose } = useInheritanceGoldPlanPurchaseDialog();

  return (
    <SuccessDialog
      title={strings.title}
      subtext={strings.subtext}
      buttonText={lang.strings.buttons.done}
      variant="gold"
      handleClick={onClose}
      withConfetti
      width={800}
      headerType="h5"
      bodyBottomPadding={4}
    />
  );
};
