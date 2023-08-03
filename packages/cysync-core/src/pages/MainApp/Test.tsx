import React, { FC, useEffect } from 'react';
import { openSendDialog } from '~/actions';
import { SendConfirmToken } from '~/dialogs/Send/Dialogs';
import { useAppDispatch } from '~/store';

export const Test: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openSendDialog());
  }, []);

  return <BitcoinTransaction />;
};
