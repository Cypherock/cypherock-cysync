import React from 'react';

import {
  AddAccountDialog,
  AddAccountSingleChainDialog,
  InitialiseAccountDialog,
  NoAccountDialog,
  SelectCryptoDialog,
  SyncAccountDialog,
} from '~/components';

export const SyncAccount: React.FC = () => (
  <div>
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
