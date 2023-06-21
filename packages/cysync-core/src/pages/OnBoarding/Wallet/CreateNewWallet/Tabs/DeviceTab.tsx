import React, { Dispatch, FC, SetStateAction } from 'react';
import {
  ConfirmPin,
  ConfirmWalletName,
  EnterWalletName,
  Instructions,
  SetupWalletPin,
  WalletPinConsent,
} from '../Dialogs';

export const DeviceTab: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
}> = ({ setState, state }) => {
  if (state === 0) return <Instructions state={state} setState={setState} />;
  if (state === 1) return <EnterWalletName state={state} setState={setState} />;
  if (state === 2)
    return <ConfirmWalletName state={state} setState={setState} />;
  if (state === 3)
    return <WalletPinConsent state={state} setState={setState} />;
  if (state === 4) return <SetupWalletPin state={state} setState={setState} />;
  if (state === 5) return <ConfirmPin state={state} setState={setState} />;
  return null;
};
