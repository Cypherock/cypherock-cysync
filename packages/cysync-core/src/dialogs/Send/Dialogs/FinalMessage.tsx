import { coinFamiliesMap } from '@cypherock/coins';
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
  SuccessDialog,
} from '@cypherock/cysync-ui';
import React from 'react';
import QRCode from 'react-qr-code';

import { openHistoryDialog } from '~/actions';
import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import { truncateMiddle } from '~/utils';

import { useSendDialog } from '../context';

interface SuccessOnlyDialogProps {
  title: string;
  subtext: string;
  buttonText: string;
  handleClick: () => void;
}
const SuccessOnlyDialog: React.FC<SuccessOnlyDialogProps> = ({
  title,
  subtext,
  buttonText,
  handleClick,
}) => (
  <>
    <ConfettiBlast />
    <SuccessDialog
      title={title}
      subtext={subtext}
      buttonText={buttonText}
      handleClick={handleClick}
    />
  </>
);

export const FinalMessage: React.FC = () => {
  const { storedTransaction, transactionLink, onClose } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const displayText = lang.strings.send.finalMessage;

  if (!storedTransaction) {
    return (
      <SuccessOnlyDialog
        title={displayText.title}
        subtext={displayText.messageBox.delayWarning}
        buttonText={lang.strings.buttons.done}
        handleClick={onClose}
      />
    );
  }

  const showHistoryDialog = () => {
    if (!storedTransaction) return;
    dispatch(openHistoryDialog({ txn: storedTransaction }));
    onClose();
  };

  let transactionHashLabel = displayText.hashLabel;
  if (storedTransaction?.familyId === coinFamiliesMap.icp) {
    transactionHashLabel = displayText.idLabel;
  } else if (storedTransaction?.familyId === coinFamiliesMap.canton) {
    transactionHashLabel = displayText.updateIdLabel;
  }

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
                      <LangDisplay text={transactionHashLabel} />
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
        <Button
          variant="primary"
          onClick={() => {
            analyticsService.trackEvent(ANALYTICS_EVENTS.SEND_SUCCEEDED, {
              action: 'completed',
            });
            showHistoryDialog();
          }}
        >
          <LangDisplay text={displayText.button} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
