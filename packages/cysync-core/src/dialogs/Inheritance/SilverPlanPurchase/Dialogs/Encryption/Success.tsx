import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';

export const EncryptionSuccess: React.FC = () => {
  const { onClose } = useInheritanceSilverPlanPurchaseDialog();

  const lang = useAppSelector(selectLanguage);

  return (
    <SuccessDialog
      title={
        lang.strings.inheritanceSilverPlanPurchase.encryption.success.title
      }
      buttonText={lang.strings.buttons.next}
      handleClick={onClose}
      onClose={onClose}
    />
  );
};