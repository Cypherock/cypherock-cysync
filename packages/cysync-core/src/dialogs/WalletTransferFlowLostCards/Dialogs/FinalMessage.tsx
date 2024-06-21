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

import { useWalletTransferLostCardsFlow } from '../context';

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
  const { onCloseDialog } = useWalletTransferLostCardsFlow();
  const { lang, wallets } = useAppSelector(selectWalletsAndLang);
  const dispatch = useAppDispatch();
  const displayText = lang.strings.guidedFlows.finalMessage;
  const tryOpeningAddAccount = () => {
    if (wallets.length > 0) {
      onCloseDialog();
      dispatch(openAddAccountDialog());
    } else {
      setShowWalletNotCreatedDialog(true);
    }
  };

  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary" onClick={onCloseDialog}>
        <LangDisplay text={displayText.buttons.secondary} />
      </Button>
      <Button variant="primary" onClick={tryOpeningAddAccount}>
        <LangDisplay text={displayText.buttons.primary} />
      </Button>
    </Flex>
  );
};

export const FinalMessage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.guidedFlows.finalMessage;
  const { onNext, onPrevious } = useWalletTransferLostCardsFlow();
  const [showWalletNotCreatedDialog, setShowWalletNotCreatedDialog] =
    useState(false);

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
