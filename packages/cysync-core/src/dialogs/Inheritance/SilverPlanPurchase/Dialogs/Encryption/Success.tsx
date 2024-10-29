import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';

export const EncryptionSuccess: React.FC = () => {
  const { onClose, onNext } = useInheritanceSilverPlanPurchaseDialog();

  const lang = useAppSelector(selectLanguage);

  return (
    <SuccessDialog
      title={
        lang.strings.inheritanceSilverPlanPurchase.encryption.success.title
      }
      subtext={
        lang.strings.inheritanceSilverPlanPurchase.encryption.success.subTitle
      }
      buttonText={lang.strings.buttons.next}
      handleClick={onNext}
      onClose={onClose}
      width={800}
      headerType="h5"
      bodyBottomPadding={4}
    />
  );
};
