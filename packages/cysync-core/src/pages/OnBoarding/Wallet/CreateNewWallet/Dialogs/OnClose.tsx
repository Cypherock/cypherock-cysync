import {
  Flex,
  Button,
  LangDisplay,
  goldFail,
  BlurOverlay,
  IconDialogBox,
  Image,
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
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowOnClose, setShowCreateWalletDialogBox }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <BlurOverlay>
      <IconDialogBox
        icon={<Image src={goldFail} alt="gold cross" />}
        title={lang.strings.onboarding.createWallet.onClose.title}
        subtext={lang.strings.onboarding.createWallet.onClose.subTitle}
        footerComponent={
          <Buttons
            setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
            setShowOnClose={setShowOnClose}
          />
        }
      />
    </BlurOverlay>
  );
};
