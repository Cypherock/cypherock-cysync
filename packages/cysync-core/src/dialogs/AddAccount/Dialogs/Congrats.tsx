import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { useAppSelector, selectLanguage } from '~/store';

import { useAddAccountDialog } from '../context';

export const AddAccountCongrats: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.congrats;
  const button = lang.strings.buttons;
  const { startAddAccounts, onClose } = useAddAccountDialog();

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        headerText={strings.header}
        title={strings.title}
        subtext={strings.subtext}
        buttonText={button.done}
        secondaryButtonText={strings.buttonAddMore}
        handleClick={onClose}
        handleSecButtonClick={startAddAccounts}
      />
    </>
  );
};
