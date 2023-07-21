import {
  LangDisplay,
  IconDialogBox,
  warningIcon,
  Button,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSendGuide } from '../context';
import { addKeyboardEvents } from '~/hooks';

export const SendProblem: React.FC = () => {
  const { onNext, onPrevious } = useSendGuide();

  const keyboardActions = {
    ArrowRight: () => {
      onNext();
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  return (
    <IconDialogBox
      header="Send Crypto"
      icon={<Image src={warningIcon} alt="sync error" />}
      title="There was some problem broadcasting the transaction"
      footerComponent={
        <Button variant="primary">
          <LangDisplay text="Retry" />
        </Button>
      }
    />
  );
};
