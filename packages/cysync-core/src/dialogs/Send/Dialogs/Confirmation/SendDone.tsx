import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Button,
  Flex,
  Typography,
  Clipboard,
  Image,
  Container,
  successIcon,
  MessageBox,
  LeanBox,
  qrImage,
  ConfettiBlast,
  GoldExternalLink,
} from '@cypherock/cysync-ui';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../context';

export const SendDone: React.FC = () => {
  const { onNext, onPrevious } = useSendDialog();
  const lang = useAppSelector(selectLanguage);

  const confirm = lang.strings.send.sendConfirm.info.dialogBox;

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
      <DialogBox width={500} align="center">
        <DialogBoxBody>
          <Image src={successIcon} alt="Success Icon" />
          <Container display="flex" direction="column" gap={32}>
            <Typography variant="h4" $textAlign="center">
              <LangDisplay text={confirm.text} />
            </Typography>

            <Image src={qrImage} alt="QR image" width="195px" height="195px" />
            <Container display="flex" direction="column" gap={48} width="full">
              <Container display="flex" direction="column" gap={8} width="full">
                <Flex justify="space-between" align="center" width="full">
                  <Flex align="center" gap={16}>
                    <Typography variant="span" color="muted" $fontSize={14}>
                      <LangDisplay text={confirm.leftText} />
                    </Typography>
                  </Flex>
                  <Flex align="center" direction="row" gap={8}>
                    <Typography variant="span" color="muted" $fontSize={14}>
                      <LangDisplay text="Copy" />
                    </Typography>
                    <Clipboard content={confirm.clipboard} size="sm" />
                  </Flex>
                </Flex>

                <LeanBox
                  text={confirm.clipboard}
                  color="white"
                  rightImage={<GoldExternalLink height={12} width={12} />}
                />
              </Container>
              <MessageBox type="warning" text={confirm.InfoBox.text} />
            </Container>
          </Container>
        </DialogBoxBody>

        <DialogBoxFooter height={101}>
          <Button variant="primary">
            <LangDisplay text={confirm.buttonCheck} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </>
  );
};
