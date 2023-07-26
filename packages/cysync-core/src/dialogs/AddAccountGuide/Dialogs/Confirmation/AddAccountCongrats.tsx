import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import {
  useAppSelector,
  useAppDispatch,
  closeDialog,
  selectLanguage,
} from '~/store';

import { useAddAccountDialog } from '../../context';

export const AddAccountCongrats: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const congo = lang.strings.addAccount.addAccount.congrats.info.dialogBox;
  const button = lang.strings.buttons;
  const dispatch = useAppDispatch();
  const { onPrevious } = useAddAccountDialog();

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        headerText={congo.header}
        title={congo.title}
        subtext={congo.subtext}
        buttonText={button.done}
        secondaryButtonText={congo.buttonAddMore}
        handleClick={() => dispatch(closeDialog('addAccountDialog'))}
        handleSecButtonClick={() => onPrevious()}
      />
    </>
  );
};
