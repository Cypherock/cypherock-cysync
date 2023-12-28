import {
  Flex,
  Button,
  LangDisplay,
  GenerateNewWalletDeviceGraphics,
  TroubleShootDialogBox,
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
import { useTroubleShoot } from '~/dialogs/TroubleShoot/context';
import {
  selectLanguage,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { WalletNotCreatedDialog } from './WalletNotCreatedDialog';

const selectWalletsAndLang = createSelector(
  [selectLanguage, selectWallets],
  (a, b) => ({ lang: a, ...b }),
);

const informationIconReactElement = (
  // <Image src={informationIcon} alt="device" $maxWidth="full" />
  <GenerateNewWalletDeviceGraphics />
);

const Buttons: FC<{
  setShowWalletNotCreatedDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowWalletNotCreatedDialog }) => {
  const { onCloseDialog } = useTroubleShoot();
  const { lang, wallets } = useAppSelector(selectWalletsAndLang);
  const dispatch = useAppDispatch();
  const { connection, connectDevice } = useDevice();
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
        connectDevice,
        doFetchFromDevice: true,
      }),
    );
  }, []);

  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary" onClick={onCloseDialog}>
        <LangDisplay
          text={lang.strings.troubleShoot.finalIssue.buttons.secondary}
        />
      </Button>
      <Button variant="primary" onClick={tryOpeningAddAccount}>
        <LangDisplay
          text={lang.strings.troubleShoot.finalIssue.buttons.primary}
        />
      </Button>
    </Flex>
  );
};

export const FinalMessage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useTroubleShoot();
  const [showWalletNotCreatedDialog, setShowWalletNotCreatedDialog] =
    useState(false);

  return (
    <>
      {showWalletNotCreatedDialog && <WalletNotCreatedDialog />}
      <TroubleShootDialogBox
        image={informationIconReactElement}
        onNext={onNext}
        onPrevious={onPrevious}
        title={lang.strings.troubleShoot.finalIssue.title}
        subtitle={lang.strings.troubleShoot.finalIssue.subtitle}
        footer={
          <Buttons
            setShowWalletNotCreatedDialog={setShowWalletNotCreatedDialog}
          />
        }
      />
    </>
  );
};
