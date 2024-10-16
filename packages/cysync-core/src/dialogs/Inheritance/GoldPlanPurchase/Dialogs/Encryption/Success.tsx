import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';

export const EncryptionSuccess: React.FC = () => {
  const { onClose, onNext } = useInheritanceGoldPlanPurchaseDialog();

  const lang = useAppSelector(selectLanguage);

  return (
    <SuccessDialog
      title={lang.strings.inheritanceGoldPlanPurchase.encryption.success.title}
      subtext={
        lang.strings.inheritanceGoldPlanPurchase.encryption.success.subtext
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
