import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';

export const EncryptionSuccess: React.FC = () => {
  const { onClose } = useInheritanceGoldPlanPurchaseDialog();

  const lang = useAppSelector(selectLanguage);

  return (
    <SuccessDialog
      title={lang.strings.inheritanceGoldPlanPurchase.encryption.success.title}
      buttonText={lang.strings.buttons.next}
      handleClick={onClose}
      onClose={onClose}
      width={560}
      headerType="h5"
      bodyBottomPadding={4}
    />
  );
};
