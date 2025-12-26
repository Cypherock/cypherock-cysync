import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../context';

export const AddAccountCongrats: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.congrats;
  const button = lang.strings.buttons;
  const { goTo, onClose, setSelectedCoin } = useAddAccountDialog();

  const handleAddMoreAccount = () => {
    setSelectedCoin(undefined);
    goTo(0, 0);
  };

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        title={strings.title}
        subtext={strings.subtext}
        buttonText={button.done}
        secondaryButtonText={strings.buttonAddMore}
        handleClick={onClose}
        handleSecButtonClick={handleAddMoreAccount}
      />
    </>
  );
};
