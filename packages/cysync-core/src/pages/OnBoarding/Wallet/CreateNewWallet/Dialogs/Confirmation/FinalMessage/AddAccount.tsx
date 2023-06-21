import {
  CreateWalletDialogBoxLayout,
  Flex,
  informationIcon,
  Button,
  Typography,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { WalletNotCreatedDialog } from './WalletNotCreatedDialog';

const Buttons: FC<{
  setShowWalletNotCreatedDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowWalletNotCreatedDialog }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="primary-outlined">
        <Typography color="gold">
          <LangDisplay
            text={
              lang.strings.onboarding.createWallet.finalMessage.addAccount
                .buttons.skip
            }
          />
        </Typography>
      </Button>
      <Button
        variant="primary"
        onClick={() => setShowWalletNotCreatedDialog(true)}
      >
        <Typography color="black">
          <LangDisplay
            text={
              lang.strings.onboarding.createWallet.finalMessage.addAccount
                .buttons.addAccount
            }
          />
        </Typography>
      </Button>
    </Flex>
  );
};

export const AddAccount: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
  setShowWalletActionsDialogBox: Dispatch<SetStateAction<boolean>>;
}> = ({
  state,
  setState,
  setShowCreateWalletDialogBox,
  setShowWalletActionsDialogBox,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [showWalletNotCreatedDialog, setShowWalletNotCreatedDialog] =
    useState(false);
  return (
    <>
      {showWalletNotCreatedDialog && (
        <WalletNotCreatedDialog
          state={state}
          setState={setState}
          setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
          setShowWalletActionsDialogBox={setShowWalletActionsDialogBox}
        />
      )}
      <CreateWalletDialogBoxLayout
        heading={
          lang.strings.onboarding.createWallet.finalMessage.addAccount.heading
        }
        title={
          lang.strings.onboarding.createWallet.finalMessage.addAccount.title
        }
        state={state}
        setState={setState}
        image={informationIcon}
        footer={
          <Buttons
            setShowWalletNotCreatedDialog={setShowWalletNotCreatedDialog}
          />
        }
      />
    </>
  );
};
