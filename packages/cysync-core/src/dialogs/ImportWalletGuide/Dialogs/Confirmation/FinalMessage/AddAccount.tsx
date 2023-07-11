import {
  GuidedFlowDialogBox,
  Flex,
  informationIcon,
  Button,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useImportWalletGuide } from '~/dialogs/ImportWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary">
        <LangDisplay
          text={
            lang.strings.importWallet.confirmation.finalMessage.addAccount
              .buttons.skip
          }
        />
      </Button>
      <Button variant="primary">
        <LangDisplay
          text={
            lang.strings.importWallet.confirmation.finalMessage.addAccount
              .buttons.addAccount
          }
        />
      </Button>
    </Flex>
  );
};

export const AddAccount: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useImportWalletGuide();

  return (
    <GuidedFlowDialogBox
      image={informationIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.importWallet.confirmation.finalMessage.addAccount.heading
      }
      title={
        lang.strings.importWallet.confirmation.finalMessage.addAccount.title
      }
      footer={<Buttons />}
    />
  );
};
