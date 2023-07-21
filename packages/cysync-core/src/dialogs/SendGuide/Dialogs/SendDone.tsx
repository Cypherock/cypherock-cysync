import React from 'react';
import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  DialogBoxFooter,
  Button,
  Flex,
  Typography,
  Clipboard,
  Image,
  Container,
  successIcon,
  Info,
  LeanBox,
  openExternalLink,
  qrImage,
  ConfettiBlast,
} from '@cypherock/cysync-ui';
import { useSendGuide } from '../context';
import { addKeyboardEvents } from '~/hooks';

export const SendDone: React.FC = () => {
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
    <>
      <ConfettiBlast />
      <DialogBox width={500}>
        <DialogBoxHeader height={56} width={500}>
          <Typography variant="fineprint" width="100%" color="muted">
            <LangDisplay text="Send crypto" />
          </Typography>
        </DialogBoxHeader>

        <DialogBoxBody>
          <Image src={successIcon} alt="Success Icon" />
          <Container display="flex" direction="column" gap={32}>
            <Typography variant="h4" $textAlign="center">
              <LangDisplay text="Transaction Sent" />
            </Typography>

            <Image src={qrImage} alt="QR image" width="195px" height="195px" />
            <Container display="flex" direction="column" gap={48} width="full">
              <Container display="flex" direction="column" gap={8} width="full">
                <Flex justify="space-between" align="center" width="full">
                  <Flex align="center" gap={16}>
                    <Typography variant="span" color="muted" $fontSize={14}>
                      <LangDisplay text="Transaction Hash" />
                    </Typography>
                  </Flex>
                  <Flex align="center" direction="row" gap={8}>
                    <Typography variant="span" color="muted" $fontSize={14}>
                      <LangDisplay text="Copy" />
                    </Typography>
                    <Clipboard
                      content="#2c70b9a11fcd.........6c31acda28"
                      size="sm"
                    />
                  </Flex>
                </Flex>

                <LeanBox
                  text="#2c70b9a11fcd.........6c31acda28"
                  color="white"
                  rightImageSrc={openExternalLink}
                />
              </Container>
              <Info
                showIcon
                iconVariant="yellow"
                textVariant="warn"
                text="Your account balance will be updated when the blockchain confirms the transaction"
              />
            </Container>
          </Container>
        </DialogBoxBody>

        <DialogBoxFooter height={101}>
          <Button variant="primary">
            <LangDisplay text="Check transactions" />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </>
  );
};
