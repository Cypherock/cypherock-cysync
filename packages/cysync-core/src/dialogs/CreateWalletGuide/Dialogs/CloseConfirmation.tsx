import {
  Flex,
  Button,
  LangDisplay,
  goldFail,
  IconDialogBox,
  Image,
  BlurOverlay,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction } from 'react';

import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const Buttons: FC<{
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button
        onClick={() => {
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
          setShowOnClose(false);
          dispatch(closeDialog('createWalletGuide'));
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

export const CloseConfirmation: FC<{
  setShowOnClose: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowOnClose }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <BlurOverlay>
      <IconDialogBox
        icon={<Image src={goldFail} alt="gold cross" />}
        title={lang.strings.onboarding.createWallet.onClose.title}
        subtext={lang.strings.onboarding.createWallet.onClose.subTitle}
        footerComponent={<Buttons setShowOnClose={setShowOnClose} />}
      />
    </BlurOverlay>
  );
};
