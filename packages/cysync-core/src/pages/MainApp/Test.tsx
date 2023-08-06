import React, { FC, useEffect } from 'react';

import { openSendDialog } from '~/actions';
import {
  BitcoinTransaction,
  OptimismVerify,
  SendConfirmToken,
  SendDeviceConfirmation,
  SendDone,
  StandardEthereum,
  StandardOptimism,
} from '~/dialogs/Send/Dialogs';
import { useAppDispatch } from '~/store';

export const Test: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openSendDialog());
  }, []);

  return (
    <>
      <BitcoinTransaction />,
      <StandardEthereum />,
      <StandardOptimism />,
      <SendDeviceConfirmation />,
      <SendConfirmToken />,
      <OptimismVerify />,
      <SendDone />
    </>
  );
};
