import {
  Flex,
  NoWalletIcon,
  Button,
  LangDisplay,
  IconDialogBox,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { openWalletActionsDialog } from '~/actions';
import { useTroubleShoot } from '~/dialogs/TroubleShoot/context';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onCloseDialog } = useTroubleShoot();
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
            lang.strings.troubleShoot.walletNotCreatedDialog.buttons.secondary
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
          text={
            lang.strings.troubleShoot.walletNotCreatedDialog.buttons.primary
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
      icon={<NoWalletIcon />}
      title={lang.strings.troubleShoot.walletNotCreatedDialog.title}
      subtext={lang.strings.troubleShoot.walletNotCreatedDialog.subtitle}
      footerComponent={<Buttons />}
    />
  );
};
