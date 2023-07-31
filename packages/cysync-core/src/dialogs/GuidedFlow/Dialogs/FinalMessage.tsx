import {
  GuidedFlowDialogBox,
  Flex,
  informationIcon,
  Button,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';

import { useGuidedFlow } from '~/dialogs/GuidedFlow/context';
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
          text={lang.strings.guidedFlows.finalMessage.buttons.secondary}
        />
      </Button>
      <Button
        variant="primary"
        onClick={() => setShowWalletNotCreatedDialog(true)}
      >
        <LangDisplay
          text={lang.strings.guidedFlows.finalMessage.buttons.primary}
        />
      </Button>
    </Flex>
  );
};

export const FinalMessage: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useGuidedFlow();
  const [showWalletNotCreatedDialog, setShowWalletNotCreatedDialog] =
    useState(false);

  return (
    <>
      {showWalletNotCreatedDialog && <WalletNotCreatedDialog />}
      <GuidedFlowDialogBox
        image={informationIcon}
        onNext={onNext}
        onPrevious={onPrevious}
        title={lang.strings.guidedFlows.finalMessage.title}
        footer={
          <Buttons
            setShowWalletNotCreatedDialog={setShowWalletNotCreatedDialog}
          />
        }
      />
    </>
  );
};
