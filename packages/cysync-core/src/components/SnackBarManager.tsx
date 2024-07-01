import { SnackBar } from '@cypherock/cysync-ui';
import React from 'react';

import { closeSnackBar, selectSnackBar, useAppDispatch } from '~/store';
import logger from '~/utils/logger';

import { useAppSelector } from '..';

export const SnackBarManager = () => {
  const snackBarState = useAppSelector(selectSnackBar);
  const dispatch = useAppDispatch();

  if (!snackBarState.isOpen) {
    return null;
  }

  if (!snackBarState.props) {
    logger.warn('SnackBarProps is Undefined');
    return null;
  }

  const onButtonClick = () => {
    dispatch(closeSnackBar());
  };

  return <SnackBar {...snackBarState.props} onButtonClick={onButtonClick} />;
};
