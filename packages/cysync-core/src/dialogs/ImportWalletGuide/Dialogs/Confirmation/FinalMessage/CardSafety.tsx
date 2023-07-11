import {
  Button,
  Flex,
  GuidedFlowDialogBox,
  LangDisplay,
  informationIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { setCurrentDialog, setCurrentTab, onNext } = useImportWalletGuide();
  const dispatch = useAppDispatch();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button onClick={onNext} variant="secondary">
        <LangDisplay
          text={
            lang.strings.importWallet.confirmation.finalMessage.cardSafety
              .buttons.skip
          }
        />
      </Button>
      <Button
        onClick={() => {
          dispatch(closeDialog('importWalletGuide'));
          setCurrentTab(0);
          setCurrentDialog(0);
        }}
        variant="primary"
      >
        <LangDisplay
          text={
            lang.strings.importWallet.confirmation.finalMessage.cardSafety
              .buttons.importOtherWallets
          }
        />
      </Button>
    </Flex>
  );
};

export const CardSafety: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();
  return (
    <GuidedFlowDialogBox
      image={informationIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.importWallet.confirmation.finalMessage.cardSafety.heading
      }
      title={
        lang.strings.importWallet.confirmation.finalMessage.cardSafety.title
      }
      infoTextVariant="warn"
      infoIconVariant="yellow"
      infoText={
        lang.strings.importWallet.confirmation.finalMessage.cardSafety.note
      }
      footer={<Buttons />}
    />
  );
};
