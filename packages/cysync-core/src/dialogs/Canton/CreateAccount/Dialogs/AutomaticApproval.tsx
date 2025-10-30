import React from 'react';

import { openEnableApprovalDialog } from '~/actions';
import { EnableApprovalPrompt } from '~/components';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { useCreateCantonAccountDialog } from '../context';

export const AutomaticApprovalDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, addedAccount } = useCreateCantonAccountDialog();
  const dispatch = useAppDispatch();

  const onEnableApproval = () => {
    onClose();
    if (!addedAccount) return;
    dispatch(openEnableApprovalDialog({ selectedAccount: addedAccount }));
  };

  return (
    <EnableApprovalPrompt
      primaryActionText={lang.strings.buttons.continue}
      primaryActionOnClick={onEnableApproval}
    />
  );
};
