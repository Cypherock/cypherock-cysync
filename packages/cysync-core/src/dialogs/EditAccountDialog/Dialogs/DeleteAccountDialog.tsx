import React from 'react';
import { DeleteAccount } from '~/components';
import { useEditAccountDialog } from '../context';

export const DeleteAccountDialog: React.FC = () => {
  const { onPrevious, onClose, selectedAccount, selectedWallet } =
    useEditAccountDialog();

  return (
    <DeleteAccount
      account={selectedAccount!}
      wallet={selectedWallet!}
      onClose={onClose}
      onAccountDeleted={onClose}
      onCancel={onPrevious}
    />
  );
};
