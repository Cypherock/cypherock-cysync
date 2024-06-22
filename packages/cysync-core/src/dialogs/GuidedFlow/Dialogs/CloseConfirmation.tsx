import {
  Flex,
  Button,
  LangDisplay,
  IconDialogBox,
  Image,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction, useEffect } from 'react';

import { closeDialog, useAppDispatch } from '~/store';

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
  closeDialogType: any;
  iconSrc?: any;
  handleEscapeKey?: boolean;
  isWalletTransfer?: boolean;
}

export const CloseConfirmation: FC<CloseConfirmationProps> = ({
  setShowOnClose,
  dialogText,
  closeDialogType,
  iconSrc,
  handleEscapeKey = true,
  isWalletTransfer = false,
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
        dispatch(closeDialog(closeDialogType));
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
      icon={<Image src={iconSrc} alt="Icon" />}
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
      isWalletTransfer={isWalletTransfer}
      messageBoxList={messageBoxList}
      pathText={pathText}
    />
  );
};

CloseConfirmation.defaultProps = {
  iconSrc: undefined,
  handleEscapeKey: true,
  isWalletTransfer: false,
};
