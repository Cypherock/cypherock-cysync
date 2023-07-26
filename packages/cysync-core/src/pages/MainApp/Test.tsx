import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openReceiveDialog } from '~/actions';

import { ReceiveAddressNotVerified } from '~/dialogs/Receive/Dialogs/Receive';

export const Test: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openReceiveDialog());
  }, []);

  return <ReceiveAddressNotVerified />;
};
