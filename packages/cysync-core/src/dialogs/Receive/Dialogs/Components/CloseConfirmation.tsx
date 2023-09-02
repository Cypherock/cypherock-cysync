import {
  Flex,
  Button,
  LangDisplay,
  IconDialogBox,
  FailIcon,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';

const Buttons: FC<{
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useReceiveDialog();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button
        onClick={() => {
          setShowOnClose(false);
        }}
        variant="secondary"
      >
        <LangDisplay text={lang.strings.buttons.cancel} />
      </Button>
      <Button
        onClick={() => {
          setShowOnClose(false);
          onClose();
        }}
        variant="primary"
      >
        <LangDisplay text={lang.strings.buttons.exit} />
      </Button>
    </Flex>
  );
};

export const CloseConfirmation: FC<{
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <IconDialogBox
      $isModal
      icon={<FailIcon />}
      title={lang.strings.dialogs.close.title}
      footerComponent={<Buttons setShowOnClose={setShowOnClose} />}
    />
  );
};
