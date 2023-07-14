import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';
import { useAppSelector, useAppDispatch, closeDialog } from '~/store';
import { useAddAccountGuide } from '../../context';

export const AddAccountCongrats: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);
  const congo = lang.addAccount.congrats.info.dialogBox;
  const dispatch = useAppDispatch();
  const { onPrevious } = useAddAccountGuide();

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        headerText={congo.header}
        title={congo.title}
        subtext={congo.subtext}
        buttonText={congo.buttonName}
        secText={congo.secButtonName}
        handleClick={() => dispatch(closeDialog('addAccountGuide'))}
        handleSecButtonClick={() => onPrevious()}
      />
    </>
  );
};
