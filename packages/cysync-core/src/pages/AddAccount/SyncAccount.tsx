// import {
//   DialogBoxBody,
//   InputLabel,
//   LangDisplay,
//   LeanBox,
//   LeanBoxContainer,
//   bitcoinIcon,
// } from '@cypherock/cysync-ui';
import {
  DropDownListItemProps,
  Dropdown,
  binanceIcon,
  bitcoinIcon,
  etheriumBlueIcon,
  solanaIcon,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

// import { openAddAccountDialog } from '~/actions';
// import {
//   AddAccountDialog,
//   AddAccountSingleChainDialog,
// } from '~/dialogs/AddAccountGuide/Dialogs';
// import { ReceiveAddressNotVerified, ReceiveAddressVerified } from '~/dialogs/Receive/Dialogs/Receive';
// import { useAppDispatch } from '~/store';

const dropDownData: DropDownListItemProps[] = [
  {
    id: '41',
    leftImageSrc: bitcoinIcon,
    shortForm: '(BTC)',
    text: 'Bitcoin',
    checkType: 'radio',
    subMenu: [
      {
        id: '143',
        leftImageSrc: solanaIcon,
        shortForm: '(SOL)',
        text: 'Solana',
        checkType: 'radio',
      },
      {
        id: '144',
        leftImageSrc: binanceIcon,
        shortForm: '(BTC)',
        text: 'Binance Smart Chain',
        checkType: 'radio',
      },
    ],
  },
  {
    id: '42',
    leftImageSrc: etheriumBlueIcon,
    text: 'Ethereum',
    shortForm: '(ETH)',
    checkType: 'radio',
  },
  {
    id: '43',
    leftImageSrc: solanaIcon,
    shortForm: '(SOL)',
    text: 'Solana',
    checkType: 'radio',
  },
  {
    id: '44',
    leftImageSrc: binanceIcon,
    shortForm: '(BTC)',
    text: 'Binance Smart Chain',
    checkType: 'radio',
  },
];

interface DropdownState {
  isFirstDropdownSelected: boolean;
  isSecondDropdownSelected: boolean;
  firstDropdownSelection: string;
  secondDropdownSelection: string | undefined;
}

export const SyncAccount: React.FC = () => {
  // const dispatch = useAppDispatch();

  useEffect(() => {
    // dispatch(openAddAccountDialog());
  }, []);
  const [dropdownState, setDropdownState] = useState<DropdownState>({
    isFirstDropdownSelected: false,
    isSecondDropdownSelected: false,
    firstDropdownSelection: '',
    secondDropdownSelection: '',
  });

  const handleFirstDropdownSelectionChange = (
    selectedItemId: string | undefined,
  ) => {
    setDropdownState(prev => ({
      ...prev,
      firstDropdownSelection: selectedItemId ?? '',
      isFirstDropdownSelected: !!selectedItemId,
    }));
  };

  return (
    <div>
      <Dropdown
        items={dropDownData}
        selectedItem={dropdownState.firstDropdownSelection}
        searchText="search"
        placeholderText="choose a coin"
        onChange={handleFirstDropdownSelectionChange}
        changeColorWhite
      />
      {/* <ReceiveAddressNotVerified />
      <ReceiveAddressVerified /> */}
      {/* <SelectCryptoDialog /> */}
      {/* <AddAccountDialog /> */}
      {/* <AddAccountSingleChainDialog /> */}
      {/* <InitialiseAccountDialog /> */}
    </div>
  );
};
