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

import { useWalletTransferLostVaulFlow } from '../context';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onCloseDialog } = useWalletTransferLostVaulFlow();
  const dispatch = useAppDispatch();
  const displayText = lang.strings.guidedFlows.walletNotCreatedDialog;
  return (
    <Flex gap={16} $zIndex={1}>
      <Button
        variant="secondary"
        onClick={() => {
          onCloseDialog();
        }}
      >
        <LangDisplay text={displayText.buttons.secondary} />
      </Button>
      <Button
        onClick={() => {
          onCloseDialog();
          dispatch(openWalletActionsDialog());
        }}
        variant="primary"
      >
        <LangDisplay text={displayText.buttons.primary} />
      </Button>
    </Flex>
  );
};

export const WalletNotCreatedDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.guidedFlows.walletNotCreatedDialog;

  return (
    <IconDialogBox
      $isModal
      icon={<NoWalletIcon />}
      title={displayText.title}
      subtext={displayText.subtitle}
      footerComponent={<Buttons />}
    />
  );
};
