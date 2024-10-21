import {
  Flex,
  Button,
  LangDisplay,
  IconDialogBox,
  Image,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';

import { IDialogState, closeDialog, useAppDispatch } from '~/store';

interface CloseConfirmationProps {
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
  dialogText: {
    title: string;
    subtitle: string;
    primaryButton: string;
    secondaryButton: string;
    pathText?: string;
    messageBoxList?: Record<string, string>[];
  };
  closeDialogType: keyof IDialogState;
  iconSrc?: string;
  handleEscapeKey?: boolean;
  isTextDifferent?: boolean;
}

export const CloseConfirmation: FC<CloseConfirmationProps> = ({
  setShowOnClose,
  dialogText,
  closeDialogType,
  iconSrc,
  handleEscapeKey = true,
  isTextDifferent = false,
}) => {
  const {
    title,
    subtitle,
    primaryButton,
    secondaryButton,
    pathText,
    messageBoxList,
  } = dialogText;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowOnClose(false);
      }
    };

    if (handleEscapeKey) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
    return undefined;
  }, [dispatch, setShowOnClose, closeDialogType, handleEscapeKey]);

  return (
    <IconDialogBox
      $isModal
      icon={<Image src={iconSrc ?? ''} alt="Icon" />}
      title={title}
      subtext={subtitle}
      footerComponent={
        <Flex gap={16} $zIndex={1}>
          <Button variant="secondary" onClick={() => setShowOnClose(false)}>
            <LangDisplay text={secondaryButton} />
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowOnClose(false);
              dispatch(closeDialog(closeDialogType));
            }}
          >
            <LangDisplay text={primaryButton} />
          </Button>
        </Flex>
      }
      isTextDifferent={isTextDifferent}
      messageBoxList={messageBoxList}
      pathText={pathText}
    />
  );
};

CloseConfirmation.defaultProps = {
  iconSrc: undefined,
  handleEscapeKey: true,
  isTextDifferent: false,
};
