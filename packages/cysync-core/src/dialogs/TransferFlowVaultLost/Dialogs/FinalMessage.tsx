import {
  Flex,
  informationIcon,
  Button,
  LangDisplay,
  Image,
  WalletTransferLessCardsFlowDialogBox,
} from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { openAddAccountDialog, syncWalletsWithDevice } from '~/actions';
import { useDevice } from '~/context';
import {
  selectLanguage,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { WalletNotCreatedDialog } from './WalletNotCreatedDialog';

import { useTransferFlow } from '../context';

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
  const { onCloseDialog } = useTransferFlow();
  const { lang, wallets } = useAppSelector(selectWalletsAndLang);
  const dispatch = useAppDispatch();
  const { connection } = useDevice();
  const tryOpeningAddAccount = () => {
    if (wallets.length > 0) {
      onCloseDialog();
      dispatch(openAddAccountDialog());
    } else {
      setShowWalletNotCreatedDialog(true);
    }
  };

  useEffect(() => {
    dispatch(
      syncWalletsWithDevice({
        connection,
        doFetchFromDevice: true,
      }),
    );
  }, []);

  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary" onClick={onCloseDialog}>
        <LangDisplay
          text={lang.strings.guidedFlows.finalMessage.buttons.secondary}
        />
      </Button>
      <Button variant="primary" onClick={tryOpeningAddAccount}>
        <LangDisplay
          text={lang.strings.guidedFlows.finalMessage.buttons.primary}
        />
      </Button>
    </Flex>
  );
};

export const FinalMessage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useTransferFlow();
  const [showWalletNotCreatedDialog, setShowWalletNotCreatedDialog] =
    useState(false);

  return (
    <>
      {showWalletNotCreatedDialog && <WalletNotCreatedDialog />}
      <WalletTransferLessCardsFlowDialogBox
        image={informationIconReactElement}
        onNext={onNext}
        onPrevious={onPrevious}
        title={lang.strings.guidedFlows.finalMessage.title}
        footer={
          <Buttons
            setShowWalletNotCreatedDialog={setShowWalletNotCreatedDialog}
          />
        }
      />
    </>
  );
};
