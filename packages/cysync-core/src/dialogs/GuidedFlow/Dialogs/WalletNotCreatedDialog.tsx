import {
  Flex,
  NoWalletIcon,
  Button,
  LangDisplay,
  IconDialogBox,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { openWalletActionsDialog } from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

interface ButtonsProps {
  onClose: () => void;
}

const Buttons: FC<ButtonsProps> = ({ onClose }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary" onClick={onClose}>
        <LangDisplay
          text={
            lang.strings.guidedFlows.walletNotCreatedDialog.buttons.secondary
          }
        />
      </Button>
      <Button
        variant="primary"
        onClick={() => {
          onClose();
          dispatch(openWalletActionsDialog());
        }}
      >
        <LangDisplay
          text={lang.strings.guidedFlows.walletNotCreatedDialog.buttons.primary}
        />
      </Button>
    </Flex>
  );
};

interface WalletNotCreatedDialogProps {
  onCloseDialog: () => void;
}

export const WalletNotCreatedDialog: FC<WalletNotCreatedDialogProps> = ({
  onCloseDialog,
}) => {
  const lang = useAppSelector(selectLanguage);

  return (
    <IconDialogBox
      $isModal
      icon={<NoWalletIcon />}
      title={lang.strings.guidedFlows.walletNotCreatedDialog.title}
      subtext={lang.strings.guidedFlows.walletNotCreatedDialog.subtitle}
      footerComponent={<Buttons onClose={onCloseDialog} />}
    />
  );
};
