import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Button,
  Flex,
  Typography,
  Image,
  Container,
  successIcon,
  MessageBox,
  ConfettiBlast,
  GoldExternalLink,
  CopyContainer,
} from '@cypherock/cysync-ui';
import React from 'react';
import QRCode from 'react-qr-code';

import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../context';

const truncateMiddle = (value: string, maxLen = 38, delimiter = '.......') => {
  const { length } = value;
  if (length < maxLen) return value;

  const shownLength = Math.floor((maxLen - delimiter.length) / 2);

  return (
    value.substring(0, shownLength) +
    delimiter +
    value.substring(length - shownLength, length)
  );
};

export const FinalMessage: React.FC = () => {
  const { transactionHash, transactionLink } = useSendDialog();
  const lang = useAppSelector(selectLanguage);

  const confirm = lang.strings.send.sendConfirm.info.dialogBox;

  return (
    <DialogBox width={500} align="center">
      <ConfettiBlast />
      <DialogBoxBody>
        <Image src={successIcon} alt="Success Icon" />
        <Container display="flex" direction="column" gap={32}>
          <Typography variant="h4" $textAlign="center">
            <LangDisplay text={confirm.text} />
          </Typography>

          <Container $bgColor="white" p="12">
            <QRCode size={228} value={transactionHash ?? ''} />
          </Container>
          <Container display="flex" direction="column" gap={48} width="full">
            <Container display="flex" direction="column" gap={8} width="full">
              <Flex justify="space-between" align="center" width="full">
                <Flex align="center" gap={16}>
                  <Typography variant="span" color="muted" $fontSize={14}>
                    <LangDisplay text={confirm.leftText} />
                  </Typography>
                </Flex>
                <Flex align="center" direction="row" gap={8}>
                  <Button
                    variant="none"
                    onClick={() => {
                      // TODO: open external link
                      window.open(transactionLink);
                    }}
                  >
                    <GoldExternalLink height={12} width={12} />
                  </Button>
                </Flex>
              </Flex>

              <CopyContainer
                link={truncateMiddle(transactionHash ?? '')}
                variant="gold"
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
  );
};
