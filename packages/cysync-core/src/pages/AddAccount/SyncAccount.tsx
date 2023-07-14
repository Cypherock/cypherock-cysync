import React, { useEffect } from 'react';
import { openAddAccountGuideDialog } from '~/actions';

import {
  AddAccountDialog,
  AddAccountSingleChainDialog,
  ConnectDevice,
  InitialiseAccountDialog,
  NoAccountDialog,
  SelectCryptoDialog,
  SyncAccountDialog,
} from '~/components';
import { useAppDispatch } from '~/store';

export const SyncAccount: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openAddAccountGuideDialog());
  }, []);

  return (
    <div>
      <ConnectDevice />
      <AddAccountDialog />
      <SelectCryptoDialog />
      <AddAccountSingleChainDialog />
      {/* <Dropdown items={selectCrypto.info.dialogBox.dropDownData} />; */}
      {/* <Dropdown items={selectCrypto.info.dialogBox.dropDownDataWithWallet} shouldChangeColor />; */}
      <InitialiseAccountDialog />
      <SyncAccountDialog />
      <NoAccountDialog />
      {/* {addAcc.info.dialogBox.dropDownData.map((item) => (
              <DropDownListItem key={item.id} {...item}/>
          ))} */}
    </div>
  );
};
