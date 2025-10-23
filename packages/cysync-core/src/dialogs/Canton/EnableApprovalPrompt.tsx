import { BlurOverlay } from '@cypherock/cysync-ui';
import React from 'react';

import { EnableApprovalPrompt } from '~/components/EnableApprovalPrompt';
import { openEnableApprovalDialog } from '~/actions/dialog';
import { closeDialog, useAppDispatch } from '~/store';

export const EnableApprovalPromptDialog = () => {
  const dispatch = useAppDispatch();

  const onClose = () => {
    dispatch(closeDialog('enableApprovalPromptDialog'));
  };

  const onEnableApproval = () => {
    onClose();
    dispatch(openEnableApprovalDialog());
  };

  return (
    <BlurOverlay>
      <EnableApprovalPrompt
        onClose={onClose}
        primaryActionText={'Enable'}
        primaryActionOnClick={onEnableApproval}
      />
    </BlurOverlay>
  );
};
