import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddTokenDialog } from '../context';

export const AddTokenCongrats: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { congrats } = lang.strings.addToken;
  const button = lang.strings.buttons;
  const { goTo, onClose, setSelectedTokens, setSelectedAccounts } =
    useAddTokenDialog();

  const handleAddMoreAccount = () => {
    setSelectedAccounts([]);
    setSelectedTokens([]);
    goTo(0, 0);
  };

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        onClose={onClose}
        title={congrats.title}
        subtext={congrats.subtitle}
        buttonText={button.done}
        secondaryButtonText={congrats.buttonAddMore}
        handleClick={onClose}
        handleSecButtonClick={handleAddMoreAccount}
      />
    </>
  );
};
