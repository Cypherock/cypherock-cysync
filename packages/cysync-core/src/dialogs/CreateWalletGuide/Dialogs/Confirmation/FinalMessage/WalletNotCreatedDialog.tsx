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
import { useCreateWalletGuide } from '~/dialogs/CreateWalletGuide/context';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { setCurrentTab: setTab, setCurrentDialog: setDialogBox } =
    useCreateWalletGuide();
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary">
        <LangDisplay
          text={
            lang.strings.onboarding.createWallet.finalMessage
              .walletNotCreatedDialog.buttons.later
          }
        />
      </Button>
      <Button
        onClick={() => {
          setTab(0);
          setDialogBox(0);
          dispatch(openWalletActionsDialog());
          dispatch(closeDialog('createWalletGuide'));
        }}
        variant="primary"
      >
        <LangDisplay
          text={
            lang.strings.onboarding.createWallet.finalMessage
              .walletNotCreatedDialog.buttons.createWallet
          }
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
      title={
        lang.strings.onboarding.createWallet.finalMessage.walletNotCreatedDialog
          .title
      }
      subtext={
        lang.strings.onboarding.createWallet.finalMessage.walletNotCreatedDialog
          .subTitle
      }
      footerComponent={<Buttons />}
    />
  );
};
