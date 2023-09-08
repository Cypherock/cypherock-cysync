import {
  Flex,
  Button,
  LangDisplay,
  IconDialogBox,
  FailIcon,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export const CloseConfirmationDialog: FC<{
  isDialogVisible: boolean;
  setIsDialogVisible: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
}> = ({ isDialogVisible, setIsDialogVisible, onClose }) => {
  const lang = useAppSelector(selectLanguage);
  // eslint-disable-next-line no-null/no-null
  if (!isDialogVisible) return null;

  return (
    <IconDialogBox
      $isModal
      icon={<FailIcon />}
      title={lang.strings.dialogs.close.title}
      footerComponent={
        <Flex gap={16} $zIndex={1}>
          <Button
            onClick={() => {
              setIsDialogVisible(false);
            }}
            variant="secondary"
          >
            <LangDisplay text={lang.strings.buttons.cancel} />
          </Button>
          <Button
            onClick={() => {
              setIsDialogVisible(false);
              onClose();
            }}
            variant="primary"
          >
            <LangDisplay text={lang.strings.buttons.exit} />
          </Button>
        </Flex>
      }
    />
  );
};
