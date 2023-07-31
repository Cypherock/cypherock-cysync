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
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { setCurrentTab: setTab, setCurrentDialog: setDialogBox } =
    useGuidedFlow();
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary">
        <LangDisplay
          text={
            lang.strings.guidedFlows.walletNotCreatedDialog.buttons.secondary
          }
        />
      </Button>
      <Button
        onClick={() => {
          setTab(0);
          setDialogBox(0);
          dispatch(openWalletActionsDialog());
          dispatch(closeDialog('guidedFlow'));
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
