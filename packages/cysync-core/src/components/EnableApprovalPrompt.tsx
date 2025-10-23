import {
  Button,
  EnableAutomaticApprovals,
  IconDialogBox,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export interface EnableApprovalPromptProps {
  onClose?: () => void;
  primaryActionText?: string;
  primaryActionOnClick?: () => void;
}

export const EnableApprovalPrompt: React.FC<EnableApprovalPromptProps> = ({
  primaryActionText,
  primaryActionOnClick,
  onClose,
}) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.cantonDialogs.enableApprovalPrompt;

  return (
    <IconDialogBox
      title={strings.title}
      subtext={strings.subTitle}
      icon={<EnableAutomaticApprovals />}
      onClose={onClose}
      footerComponent={
        <Button variant="primary" onClick={primaryActionOnClick}>
          {primaryActionText}
        </Button>
      }
    />
  );
};

EnableApprovalPrompt.defaultProps = {
  primaryActionText: undefined,
  primaryActionOnClick: undefined,
  onClose: undefined,
};
