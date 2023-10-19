import { SnackBar } from '@cypherock/cysync-ui';
import React from 'react';

import { selectSnackBar } from '~/store';
import logger from '~/utils/logger';

import { useAppSelector } from '..';

export const SnackBarManager = () => {
  const snackBarState = useAppSelector(selectSnackBar);

  if (!snackBarState.isOpen) {
    return null;
  }

  if (!snackBarState.props) {
    logger.warn('SnackBarProps is Undefined');
    return null;
  }

  return <SnackBar {...snackBarState.props} />;
};
