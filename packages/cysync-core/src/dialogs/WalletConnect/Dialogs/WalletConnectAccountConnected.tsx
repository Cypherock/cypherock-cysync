import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useWalletConnectDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletConnectAccountConnectedDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useWalletConnectDialog();
  const { buttons } = lang.strings;

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5} />
      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={false}
          onClick={e => {
            e.preventDefault();
            onClose();
          }}
        >
          <LangDisplay text={buttons.disconnect} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
