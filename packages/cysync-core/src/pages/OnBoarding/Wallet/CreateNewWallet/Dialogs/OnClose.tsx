import {
  Flex,
  CreateWalletDialogBoxLayout,
  Button,
  Typography,
  LangDisplay,
  goldFail,
  BlurOverlay,
  DialogBox,
  DialogBoxBody,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

const Buttons: FC<{
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowCreateWalletDialogBox, setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <Flex gap={16} $zIndex={1}>
      <Button
        onClick={() => {
          setShowCreateWalletDialogBox(true);
          setShowOnClose(false);
        }}
        variant="primary-outlined"
      >
        <Typography color="gold">
          <LangDisplay
            text={lang.strings.onboarding.createWallet.onClose.buttons.cancel}
          />
        </Typography>
      </Button>
      <Button
        onClick={() => {
          setShowCreateWalletDialogBox(false);
          setShowOnClose(false);
        }}
        variant="primary"
      >
        <Typography color="black">
          <LangDisplay
            text={lang.strings.onboarding.createWallet.onClose.buttons.exit}
          />
        </Typography>
      </Button>
    </Flex>
  );
};

export const OnClose: FC<{
  state: number;
  setState: Dispatch<SetStateAction<number>>;
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
}> = ({ state, setState, setShowOnClose, setShowCreateWalletDialogBox }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <BlurOverlay>
      <DialogBox width={500}>
        <DialogBoxBody p="0" pt={2}>
          <CreateWalletDialogBoxLayout
            title={lang.strings.onboarding.createWallet.onClose.title}
            subTitle={lang.strings.onboarding.createWallet.onClose.subTitle}
            footer={
              <Buttons
                setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
                setShowOnClose={setShowOnClose}
              />
            }
            state={state}
            setState={setState}
            image={goldFail}
          />
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
