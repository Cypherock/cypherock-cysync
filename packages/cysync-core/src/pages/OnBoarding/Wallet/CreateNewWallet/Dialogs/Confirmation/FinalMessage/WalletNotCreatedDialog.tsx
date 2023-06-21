import {
  Flex,
  CreateWalletDialogBoxLayout,
  redDisconnectedIcon,
  Button,
  BlurOverlay,
  DialogBox,
  DialogBoxBody,
  Typography,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

const Buttons: FC<{
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
  setShowWalletActionsDialogBox: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowCreateWalletDialogBox, setShowWalletActionsDialogBox }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="primary-outlined">
        <Typography color="gold">
          <LangDisplay
            text={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.buttons.later
            }
          />
        </Typography>
      </Button>
      <Button
        onClick={() => {
          setShowCreateWalletDialogBox(false);
          setShowWalletActionsDialogBox(true);
        }}
        variant="primary"
      >
        <Typography color="black">
          <LangDisplay
            text={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.buttons.createWallet
            }
          />
        </Typography>
      </Button>
    </Flex>
  );
};

export const WalletNotCreatedDialog: FC<{
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
  return (
    <BlurOverlay>
      <DialogBox width={500}>
        <DialogBoxBody p="0" pt={2}>
          <CreateWalletDialogBoxLayout
            title={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.title
            }
            subTitle={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.subTitle
            }
            state={state}
            footer={
              <Buttons
                setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
                setShowWalletActionsDialogBox={setShowWalletActionsDialogBox}
              />
            }
            setState={setState}
            image={redDisconnectedIcon}
          />
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
