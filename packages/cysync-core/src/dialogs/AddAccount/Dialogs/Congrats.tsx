import { coinFamiliesMap } from '@cypherock/coins';
import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../context';

export const AddAccountCongrats: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.congrats;
  const button = lang.strings.buttons;
  const { goTo, onClose, selectedCoin, setSelectedCoin } =
    useAddAccountDialog();

  const handleAddMoreAccount = () => {
    setSelectedCoin(undefined);
    goTo(0, 0);
  };

  const isCanton = selectedCoin?.family === coinFamiliesMap.canton;

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        title={strings.title}
        subtext={strings.subtext}
        buttonText={button.done}
        secondaryButtonText={!isCanton ? strings.buttonAddMore : undefined}
        handleClick={onClose}
        handleSecButtonClick={!isCanton ? handleAddMoreAccount : undefined}
      />
    </>
  );
};
