import { SuccessDialog, Image, silverTickIcon } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../context';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceSilverPlanPurchase.checkout.success;

  const { onClose } = useInheritanceSilverPlanPurchaseDialog();

  return (
    <SuccessDialog
      title={strings.title}
      subtext={strings.subtext}
      buttonText={lang.strings.buttons.done}
      handleClick={onClose}
      icon={<Image src={silverTickIcon} alt="Success icon" />}
      withConfetti
      width={800}
      headerType="h5"
      bodyBottomPadding={4}
    />
  );
};
