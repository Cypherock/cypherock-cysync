import {
  Button,
  UtxoMergeIcon,
  IconDialogBox,
  Typography,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export interface EnableMergeDelegationPromptProps {
  onClose?: () => void;
  primaryActionText: string;
  primaryActionOnClick: () => void;
  secondaryActionText?: string;
  secondaryActionOnClick?: () => void;
}

export const EnableMergeDelegationPrompt: React.FC<
  EnableMergeDelegationPromptProps
> = ({
  primaryActionText,
  primaryActionOnClick,
  secondaryActionText,
  secondaryActionOnClick,
  onClose,
}) => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.cantonDialogs.enableMergeDelegation.dialogs.summary;

  return (
    <IconDialogBox
      title={strings.title}
      subtext={strings.subTitle}
      icon={<UtxoMergeIcon />}
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

EnableMergeDelegationPrompt.defaultProps = {
  onClose: undefined,
  secondaryActionText: undefined,
  secondaryActionOnClick: undefined,
};
