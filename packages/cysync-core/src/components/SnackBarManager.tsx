import { SnackBar } from '@cypherock/cysync-ui';
import React from 'react';
import { selectSnackBar } from '~/store';
import { useAppSelector } from '..';

export const SnackBarManager = () => {
  const snackBarState = useAppSelector(selectSnackBar);

  if (!snackBarState.isOpen) {
    return null;
  }

  // the below error will be fired in case props are not properly handled by redux state
  if (!snackBarState.props) throw new Error('SnackBarProps is Undefined');

  return <SnackBar {...snackBarState.props} />;
};
