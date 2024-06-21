import {
  Flex,
  informationIcon,
  Button,
  LangDisplay,
  Image,
  WalletTransferLostCardsFlowDialogBox,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';

import { openAddAccountDialog } from '~/actions';
import {
  selectLanguage,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { WalletNotCreatedDialog } from './WalletNotCreatedDialog';

import { useWalletTransferLostVaulFlow } from '../context';

const selectWalletsAndLang = createSelector(
  [selectLanguage, selectWallets],
  (a, b) => ({ lang: a, ...b }),
);

const informationIconReactElement = (
  <Image src={informationIcon} alt="device" $maxWidth="full" />
);

const Buttons: FC<{
  setShowWalletNotCreatedDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowWalletNotCreatedDialog }) => {
  const { onCloseDialog } = useWalletTransferLostVaulFlow();
  const { lang, wallets } = useAppSelector(selectWalletsAndLang);
  const dispatch = useAppDispatch();
  const tryOpeningAddAccount = () => {
    if (wallets.length > 0) {
      onCloseDialog();
      dispatch(openAddAccountDialog());
    } else {
      setShowWalletNotCreatedDialog(true);
    }
  };
  const displayText = lang.strings.guidedFlows.finalMessage.buttons;

  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary" onClick={onCloseDialog}>
        <LangDisplay text={displayText.secondary} />
      </Button>
      <Button variant="primary" onClick={tryOpeningAddAccount}>
        <LangDisplay text={displayText.primary} />
      </Button>
    </Flex>
  );
};

export const FinalMessage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletTransferLostVaulFlow();
  const [showWalletNotCreatedDialog, setShowWalletNotCreatedDialog] =
    useState(false);
  const displayText = lang.strings.guidedFlows.finalMessage;

  return (
    <>
      {showWalletNotCreatedDialog && <WalletNotCreatedDialog />}
      <WalletTransferLostCardsFlowDialogBox
        image={informationIconReactElement}
        onNext={onNext}
        onPrevious={onPrevious}
        title={displayText.title}
        footer={
          <Buttons
            setShowWalletNotCreatedDialog={setShowWalletNotCreatedDialog}
          />
        }
      />
    </>
  );
};
