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
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
  setShowWalletActionsDialogBox: Dispatch<SetStateAction<boolean>>;
}> = ({
  setState,
  state,
  setShowCreateWalletDialogBox,
  setShowWalletActionsDialogBox,
}) => {
  if (state === 7) return <SuccessMessage state={state} setState={setState} />;
  if (state === 8) return <WalletNote state={state} setState={setState} />;
  if (state === 9) return <CardNote state={state} setState={setState} />;
  if (state === 10) return <CardSafety state={state} setState={setState} />;
  if (state === 11)
    return <AddAnotherWallet state={state} setState={setState} />;
  if (state === 12)
    return (
      <AddAccount
        state={state}
        setState={setState}
        setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
        setShowWalletActionsDialogBox={setShowWalletActionsDialogBox}
      />
    );
  return null;
};
