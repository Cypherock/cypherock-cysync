import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { useAppSelector, selectLanguage } from '~/store';

import { useAddAccountDialog } from '../../context';
import { useCloseDialogBox } from '~/hooks';

export const AddAccountCongrats: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const congo = lang.strings.addAccount.addAccount.congrats.info.dialogBox;
  const button = lang.strings.buttons;
  const { onPrevious } = useAddAccountDialog();
  const closeDialogBox = useCloseDialogBox();

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        title={congo.title}
        subtext={congo.subtext}
        buttonText={button.done}
        secondaryButtonText={congo.buttonAddMore}
        handleClick={() => closeDialogBox('addAccountDialog')}
        handleSecButtonClick={() => onPrevious()}
      />
    </>
  );
};
