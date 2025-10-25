import {
  ConfettiBlast,
  SuccessDialog,
  successIcon,
  Image,
  FailIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { TransactionActionType, useTransactionActionDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';

export const SuccessDialogComponent: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.cantonDialogs.transactionAction.dialogs;
  const { onFinishCreateAccount, transactionActionType } =
    useTransactionActionDialog();

  const getDialogIcon = (actionType: TransactionActionType) => {
    switch (actionType) {
      case TransactionActionType.APPROVE:
        return <Image src={successIcon} alt="Success icon" />;
      case TransactionActionType.REJECT:
        return <FailIcon />;
      case TransactionActionType.CANCEL:
        return <FailIcon />;
      default:
        return <Image src={successIcon} alt="Success icon" />;
    }
  };

  return (
    <>
      {transactionActionType === TransactionActionType.APPROVE && (
        <ConfettiBlast />
      )}
      <SuccessDialog
        icon={getDialogIcon(transactionActionType)}
        title={strings.success[transactionActionType]}
        buttonText={lang.strings.buttons.done}
        handleClick={onFinishCreateAccount}
      />
    </>
  );
};
