import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, { FC } from 'react';

import { DeleteAccount, closeDialog, useAppDispatch } from '..';

export interface DeleteAccountDialogProps {
  account: IAccount;
  wallet?: IWallet;
}

export const DeleteAccountDialog: FC<DeleteAccountDialogProps> = ({
  account,
  wallet,
}) => {
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeDialog('deleteAccount'));
  };

  return (
    <DeleteAccount
      account={account}
      wallet={wallet}
      onClose={onClose}
      onAccountDeleted={onClose}
      onCancel={onClose}
    />
  );
};

DeleteAccountDialog.defaultProps = {
  wallet: undefined,
};
