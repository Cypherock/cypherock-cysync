import {
  Flex,
  Button,
  LangDisplay,
  Image,
  informationIcon,
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

const selectWalletsAndLang = createSelector(
  [selectLanguage, selectWallets],
  (a, b) => ({ lang: a, ...b }),
);

const Buttons: FC<{
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  onCloseDialog: () => void;
}> = ({ setShowDialog, onCloseDialog }) => {
  const dispatch = useAppDispatch();
  const { lang, wallets } = useAppSelector(selectWalletsAndLang);
  const displayText = lang.strings.guidedFlows.finalMessage;
  const tryOpeningAddAccount = () => {
    if (wallets.length > 0) {
      onCloseDialog();
      dispatch(openAddAccountDialog());
    } else {
      setShowDialog(true);
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

export const FinalMessage: FC<{
  DialogBox: React.ComponentType<any>;
  contextHook: () => {
    onNext: () => void;
    onPrevious: () => void;
    onCloseDialog: () => void;
    changeCondition?: () => void;
    onSelect?: () => void;
  };
}> = ({ DialogBox, contextHook }) => {
  const { onNext, onPrevious, onCloseDialog, changeCondition, onSelect } =
    contextHook();
  const [showDialog, setShowDialog] = useState(false);
  const lang = useAppSelector(selectLanguage);

  return (
    <>
      {showDialog && <WalletNotCreatedDialog onCloseDialog={onCloseDialog} />}
      <DialogBox
        image={<Image src={informationIcon} alt="device" $maxWidth="full" />}
        onNext={onNext}
        onPrevious={onPrevious}
        changeCondition={changeCondition}
        onSelect={onSelect}
        title={lang.strings.guidedFlows.finalMessage.title}
        lang={lang}
        footer={
          <Buttons
            setShowDialog={setShowDialog}
            onCloseDialog={onCloseDialog}
          />
        }
      />
    </>
  );
};
