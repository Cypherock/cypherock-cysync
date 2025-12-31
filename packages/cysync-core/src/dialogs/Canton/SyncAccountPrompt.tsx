import {
  BlurOverlay,
  Button,
  IconDialogBox,
  Image,
  walletErrorIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { closeDialog, useAppDispatch } from '~/store';
import { openCantonLoginDialog } from '~/actions';

export const SyncAccountPromptDialog = () => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeDialog('syncCantonAccountPromptDialog'));
  };

  const onSyncAccount = () => {
    onClose();
    dispatch(openCantonLoginDialog());
  };

  return (
    <BlurOverlay>
      <IconDialogBox
        icon={<Image src={walletErrorIcon} alt="walletSync" />}
        title="Seems like your canton account is out of sync. Proceed to sync account?"
        onClose={onClose}
        footerComponent={
          <>
            <Button variant="secondary" onClick={onClose}>
              Skip
            </Button>
            <Button variant="primary" onClick={onSyncAccount}>
              Sync
            </Button>
          </>
        }
      />
    </BlurOverlay>
  );
};
