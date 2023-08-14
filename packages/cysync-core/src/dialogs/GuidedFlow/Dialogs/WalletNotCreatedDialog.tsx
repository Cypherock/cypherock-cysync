import {
  Flex,
  redDisconnectedIcon,
  Button,
  LangDisplay,
  IconDialogBox,
  Image,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { openWalletActionsDialog } from '~/actions';
import { useGuidedFlow } from '~/dialogs/GuidedFlow/context';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onCloseDialog } = useGuidedFlow();
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button
        variant="secondary"
        onClick={() => {
          onCloseDialog();
        }}
      >
        <LangDisplay
          text={
            lang.strings.guidedFlows.walletNotCreatedDialog.buttons.secondary
          }
        />
      </Button>
      <Button
        onClick={() => {
          onCloseDialog();
          dispatch(openWalletActionsDialog());
        }}
        variant="primary"
      >
        <LangDisplay
          text={lang.strings.guidedFlows.walletNotCreatedDialog.buttons.primary}
        />
      </Button>
    </Flex>
  );
};

export const WalletNotCreatedDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  return (
    <IconDialogBox
      $isModal
      icon={<Image src={redDisconnectedIcon} alt="Disconnected icon" />}
      title={lang.strings.guidedFlows.walletNotCreatedDialog.title}
      subtext={lang.strings.guidedFlows.walletNotCreatedDialog.subtitle}
      footerComponent={<Buttons />}
    />
  );
};
