import {
  Button,
  Flex,
  GuidedFlowDialogBox,
  LangDisplay,
  informationIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletActions } from '~/context/walletActions';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { setCurrentDialogBox, setCurrentTab, onNext } = useWalletActions();
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button onClick={onNext} variant="secondary">
        <LangDisplay
          text={
            lang.strings.walletActions.common.confirmation.finalMessage
              .cardSafety.buttons.skip
          }
        />
      </Button>
      <Button
        onClick={() => {
          dispatch(closeDialog('importWalletGuide'));
          setCurrentTab(0);
          setCurrentDialogBox(0);
        }}
        variant="primary"
      >
        <LangDisplay
          text={
            lang.strings.walletActions.common.confirmation.finalMessage
              .cardSafety.buttons.importOtherWallets
          }
        />
      </Button>
    </Flex>
  );
};

export const ImportWalletCardSafety: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useWalletActions();
  return (
    <GuidedFlowDialogBox
      image={informationIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.walletActions.common.confirmation.finalMessage.cardSafety
          .heading
      }
      title={
        lang.strings.walletActions.common.confirmation.finalMessage.cardSafety
          .title
      }
      infoTextVariant="warn"
      infoIconVariant="yellow"
      infoText={
        lang.strings.walletActions.common.confirmation.finalMessage.cardSafety
          .note
      }
      footer={<Buttons />}
    />
  );
};
