import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
  verifyAmountIcon,
  Typography,
  Image,
  Container,
} from '@cypherock/cysync-ui';
import React from 'react';
import { addKeyboardEvents } from '~/hooks';
import { useSendDialog } from '../../context';

export const DeniedOnDevice: React.FC = () => {
  const { onNext, onPrevious } = useSendDialog();

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
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={verifyAmountIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={12} width="full">
          <Typography variant="h5" $textAlign="center" color="error">
            <LangDisplay text="Transaction was cancelled from the X1 Vault" />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text="Please make sure to authorize the transaction on your device before attempting again" />
          </Typography>
          <Typography
            variant="span"
            $textAlign="center"
            color="muted"
            $fontSize={14}
          >
            <LangDisplay text="Make sure you confirm the transaction on the device to successfully complete the transaction" />
          </Typography>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text="Exit" />
        </Button>
        <Button variant="primary">
          <LangDisplay text="Retry" />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
