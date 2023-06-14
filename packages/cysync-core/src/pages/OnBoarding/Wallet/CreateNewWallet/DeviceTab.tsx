import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  ConfirmPin,
  ConfirmWalletName,
  EnterWalletName,
  Instructions,
  SetupWalletPin,
  WalletPinConsent,
} from './Dialogs';

export const DeviceTab: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState, state }) => {
  if (state === 0) return <Instructions setState={setState} />;
  if (state === 1) return <EnterWalletName setState={setState} />;
  if (state === 2) return <ConfirmWalletName setState={setState} />;
  if (state === 3) return <WalletPinConsent setState={setState} />;
  if (state === 4) return <SetupWalletPin setState={setState} />;
  if (state === 5) return <ConfirmPin setState={setState} />;
  return null;
};
