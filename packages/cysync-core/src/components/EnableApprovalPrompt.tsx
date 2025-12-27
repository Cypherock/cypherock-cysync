import {
  Button,
  EnableAutomaticApprovals,
  IconDialogBox,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export interface EnableApprovalPromptProps {
  onClose?: () => void;
  primaryActionText: string;
  primaryActionOnClick: () => void;
  secondaryActionText?: string;
  secondaryActionOnClick?: () => void;
}

export const EnableApprovalPrompt: React.FC<EnableApprovalPromptProps> = ({
  primaryActionText,
  primaryActionOnClick,
  secondaryActionText,
  secondaryActionOnClick,
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
      allowMarkdown
      afterTextComponent={
        <Typography
          variant="h6"
          $textAlign="center"
          color="muted"
          $fontWeight="semibold"
        >
          <LangDisplay text={strings.note} $allowMarkdown />
        </Typography>
      }
      footerComponent={
        <>
          {secondaryActionText && secondaryActionOnClick && (
            <Button variant="secondary" onClick={secondaryActionOnClick}>
              {secondaryActionText}
            </Button>
          )}
          <Button variant="primary" onClick={primaryActionOnClick}>
            {primaryActionText}
          </Button>
        </>
      }
    />
  );
};

EnableApprovalPrompt.defaultProps = {
  onClose: undefined,
  secondaryActionText: undefined,
  secondaryActionOnClick: undefined,
};
