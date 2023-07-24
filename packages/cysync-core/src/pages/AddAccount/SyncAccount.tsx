// import {
//   DialogBoxBody,
//   InputLabel,
//   LangDisplay,
//   LeanBox,
//   LeanBoxContainer,
//   bitcoinIcon,
// } from '@cypherock/cysync-ui';

import React, { useEffect } from 'react';
import { openAddAccountDialog } from '~/actions';
import { useAppDispatch } from '~/store';

// import { openAddAccountDialog } from '~/actions';
// import {
//   AddAccountDialog,
//   AddAccountSingleChainDialog,
// } from '~/dialogs/AddAccountGuide/Dialogs';
// import { ReceiveAddressNotVerified, ReceiveAddressVerified } from '~/dialogs/Receive/Dialogs/Receive';
// import { useAppDispatch } from '~/store';

export const SyncAccount: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openAddAccountDialog());
  }, []);

  return (
    <div>
      {/* <ReceiveAddressNotVerified />
      <ReceiveAddressVerified /> */}
      {/* <SelectCryptoDialog /> */}
      {/* <AddAccountDialog /> */}
      {/* <AddAccountSingleChainDialog /> */}
      {/* <InitialiseAccountDialog /> */}
    </div>
  );
};
