import {
  BlurOverlay,
  Button,
  IconDialogBox,
  Image,
  walletErrorIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { openCantonLoginDialog } from '~/actions';

export const SyncAccountPromptDialog = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

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
        title={lang.strings.dialogs.cantonDialogs.syncAccountPrompt.title}
        onClose={onClose}
        footerComponent={
          <>
            <Button variant="secondary" onClick={onClose}>
              {lang.strings.buttons.skip}
            </Button>
            <Button variant="primary" onClick={onSyncAccount}>
              {lang.strings.buttons.proceed}
            </Button>
          </>
        }
      />
    </BlurOverlay>
  );
};
