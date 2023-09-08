import { getParsedAmount } from '@cypherock/coin-support-utils';
import {
  LangDisplay,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
  Typography,
  Container,
  ScrollableContainer,
  DialogBox,
  GoldQuestionMark,
  LeanBox,
  InformationIcon,
  useTheme,
} from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { FeeSection, AddressAndAmountSection } from './Components';

import { useSendDialog } from '../context';

export const Recipient: React.FC = () => {
  const { onNext, onPrevious, initialize, transaction, selectedAccount } =
    useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const theme = useTheme();
  const displayText = lang.strings.send.recipient;

  const getBalanceToDisplay = () => {
    const account = selectedAccount;
    if (!account) return `0`;
    const { amount: _amount, unit } = getParsedAmount({
      coinId: account.assetId,
      unitAbbr: account.unit,
      amount: account.balance,
    });
    return `${_amount} ${unit.abbr}`;
  };

  const [btnState, handleButtonState] = useState(false);
  useEffect(() => {
    handleButtonState(
      !!transaction &&
        transaction.validation.hasEnoughBalance &&
        transaction.validation.outputs.length > 0 &&
        transaction.validation.outputs.every(output => output) &&
        transaction.userInputs.outputs.every(
          output => output.address !== '' && output.amount !== '',
        ),
    );
  }, [transaction]);

  useEffect(() => {
    initialize();
  }, []);

  if (transaction === undefined) return <LoaderDialog />;

  return (
    <DialogBox width={517}>
      <DialogBoxBody pt={4} pb={0}>
        <Container display="flex" direction="column" gap={4} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={displayText.title} />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text={displayText.subtitle} />
          </Typography>
        </Container>
        <LeanBox
          leftImage={
            <InformationIcon
              height={16}
              width={16}
              fill={theme.palette.background.muted}
            />
          }
          pt={2}
          text={displayText.infoBox}
          altText={getBalanceToDisplay()}
          textVariant="span"
          fontSize={12}
          rightImage={<GoldQuestionMark height={14} width={14} />}
        />
      </DialogBoxBody>
      <ScrollableContainer $maxHeight={{ def: '40vh', lg: '65vh' }}>
        <AddressAndAmountSection />
        <FeeSection />
      </ScrollableContainer>
      <DialogBoxFooter>
        <Button
          variant="secondary"
          onClick={() => {
            onPrevious();
          }}
        >
          <LangDisplay text={button.back} />
        </Button>
        <Button
          variant="primary"
          disabled={!btnState}
          onClick={() => {
            onNext();
          }}
        >
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
