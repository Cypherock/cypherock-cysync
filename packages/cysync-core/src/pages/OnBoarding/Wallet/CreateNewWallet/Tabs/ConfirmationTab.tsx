import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  AddAccount,
  AddAnotherWallet,
  CardNote,
  CardSafety,
  SuccessMessage,
  WalletNote,
} from '../Dialogs';

export const ConfirmationTab: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState, state }) => {
  if (state === 7) return <SuccessMessage setState={setState} />;
  if (state === 8) return <WalletNote setState={setState} />;
  if (state === 9) return <CardNote setState={setState} />;
  if (state === 10) return <CardSafety setState={setState} />;
  if (state === 11) return <AddAnotherWallet setState={setState} />;
  if (state === 12) return <AddAccount setState={setState} />;
  return null;
};
