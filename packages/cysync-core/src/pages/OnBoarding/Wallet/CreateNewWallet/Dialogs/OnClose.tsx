import {
  Flex,
  GuidedFlowDialogBoxLayout,
  Button,
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
        variant="secondary"
      >
        <LangDisplay
          text={lang.strings.onboarding.createWallet.onClose.buttons.cancel}
        />
      </Button>
      <Button
        onClick={() => {
          setShowCreateWalletDialogBox(false);
          setShowOnClose(false);
        }}
        variant="primary"
      >
        <LangDisplay
          text={lang.strings.onboarding.createWallet.onClose.buttons.exit}
        />
      </Button>
    </Flex>
  );
};

export const OnClose: FC<{
  onNext: React.MouseEventHandler<HTMLButtonElement>;
  onPrevious: React.MouseEventHandler<HTMLButtonElement>;
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
}> = ({ onNext, onPrevious, setShowOnClose, setShowCreateWalletDialogBox }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <BlurOverlay>
      <DialogBox width={500}>
        <DialogBoxBody p="0" pt={2}>
          <GuidedFlowDialogBoxLayout
            image={goldFail}
            onNext={onNext}
            onPrevious={onPrevious}
            title={lang.strings.onboarding.createWallet.onClose.title}
            subTitle={lang.strings.onboarding.createWallet.onClose.subTitle}
            footer={
              <Buttons
                setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
                setShowOnClose={setShowOnClose}
              />
            }
          />
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
