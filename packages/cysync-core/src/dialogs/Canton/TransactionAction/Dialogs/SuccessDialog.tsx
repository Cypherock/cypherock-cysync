import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { TransactionActionType, useTransactionActionDialog } from '../context';

export const SuccessDialogComponent: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.cantonDialogs.transactionAction.dialogs;
  const { onFinishTransactionAction, transactionActionType } =
    useTransactionActionDialog();

  return (
    <>
      {transactionActionType === TransactionActionType.APPROVE && (
        <ConfettiBlast />
      )}
      <SuccessDialog
        title={strings.success[transactionActionType]}
        buttonText={lang.strings.buttons.done}
        handleClick={onFinishTransactionAction}
      />
    </>
  );
};
