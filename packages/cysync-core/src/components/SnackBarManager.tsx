import { SnackBar } from '@cypherock/cysync-ui';
import React from 'react';
import { selectSnackBar } from '~/store';
import { useAppSelector } from '..';

export const SnackBarManager = () => {
  const snackBarState = useAppSelector(selectSnackBar);

  if (!snackBarState.isOpen) {
    return null;
  }

  return (
    <SnackBar
      text={snackBarState.text}
      imageSrc={snackBarState.imageSrc}
      imageAlt={snackBarState.imageAlt}
      buttonName={snackBarState.buttonName}
    />
  );
};
