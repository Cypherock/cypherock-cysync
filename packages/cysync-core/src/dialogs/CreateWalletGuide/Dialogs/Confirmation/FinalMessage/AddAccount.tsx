import {
  GuidedFlowDialogBox,
  Flex,
  informationIcon,
  Button,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';

import { useCreateWalletGuide } from '~/dialogs/CreateWalletGuide/context';
import { selectLanguage, useAppSelector } from '~/store';

import { WalletNotCreatedDialog } from './WalletNotCreatedDialog';

const Buttons: FC<{
  setShowWalletNotCreatedDialog: Dispatch<SetStateAction<boolean>>;
}> = ({ setShowWalletNotCreatedDialog }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary">
        <LangDisplay
          text={
            lang.strings.onboarding.createWallet.finalMessage.addAccount.buttons
              .skip
          }
        />
      </Button>
      <Button
        variant="primary"
        onClick={() => setShowWalletNotCreatedDialog(true)}
      >
        <LangDisplay
          text={
            lang.strings.onboarding.createWallet.finalMessage.addAccount.buttons
              .addAccount
          }
        />
      </Button>
    </Flex>
  );
};

export const AddAccount: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateWalletGuide();
  const [showWalletNotCreatedDialog, setShowWalletNotCreatedDialog] =
    useState(false);

  return (
    <>
      {showWalletNotCreatedDialog && <WalletNotCreatedDialog />}
      <GuidedFlowDialogBox
        image={informationIcon}
        onNext={onNext}
        onPrevious={onPrevious}
        heading={
          lang.strings.onboarding.createWallet.finalMessage.addAccount.heading
        }
        title={
          lang.strings.onboarding.createWallet.finalMessage.addAccount.title
        }
        footer={
          <Buttons
            setShowWalletNotCreatedDialog={setShowWalletNotCreatedDialog}
          />
        }
      />
    </>
  );
};
