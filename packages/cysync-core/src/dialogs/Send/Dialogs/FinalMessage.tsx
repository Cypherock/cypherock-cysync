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
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import React from 'react';
import QRCode from 'react-qr-code';

import { openHistoryDialog } from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import { truncateMiddle } from '~/utils';

import { useSendDialog } from '../context';

export const FinalMessage: React.FC = () => {
  const { storedTransaction, transactionLink, onClose } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const displayText = lang.strings.send.finalMessage;
  const showHistoryDialog = () => {
    if (!storedTransaction) return;
    dispatch(openHistoryDialog({ txn: storedTransaction }));
    onClose();
  };

  return (
    <DialogBox width={500} align="center">
      <ConfettiBlast />
      <DialogBoxBody p={0} pt={5}>
        <Image src={successIcon} alt="Success Icon" />
        <Typography variant="h4" $textAlign="center">
          <LangDisplay text={displayText.title} />
        </Typography>
        <ScrollableContainer $maxHeight={{ def: '40vh', lg: '65vh' }}>
          <DialogBoxBody p={0} px={4} pb={5}>
            <Container $bgColor="white" p="12">
              <QRCode size={228} value={storedTransaction?.hash ?? ''} />
            </Container>
            <Container display="flex" direction="column" gap={48} width="full">
              <Container display="flex" direction="column" gap={8} width="full">
                <Flex justify="space-between" align="center" width="full">
                  <Flex align="center" gap={16}>
                    <Typography variant="span" color="muted" $fontSize={14}>
                      <LangDisplay text={displayText.hashLabel} />
                    </Typography>
                  </Flex>
                  <Flex align="center" direction="row" gap={8}>
                    <a
                      href={transactionLink}
                      target="_blank"
                      style={{ textDecoration: 'none' }}
                      rel="noreferrer"
                    >
                      <GoldExternalLink height={12} width={12} />
                    </a>
                  </Flex>
                </Flex>

                <CopyContainer
                  link={truncateMiddle(storedTransaction?.hash ?? '')}
                  copyValue={storedTransaction?.hash}
                  variant="gold"
                />
              </Container>
              <MessageBox
                type="warning"
                text={displayText.messageBox.warning}
              />
            </Container>
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBoxBody>

      <DialogBoxFooter height={101}>
        <Button variant="primary" onClick={showHistoryDialog}>
          <LangDisplay text={displayText.button} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
