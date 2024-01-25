import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  InformationIcon,
  LangDisplay,
  LeanBox,
  ScrollableContainer,
  Typography,
  useTheme,
  BlockchainIcon,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React, { useEffect, useState } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { AddressAndAmountSection, FeeSection } from './Components';

import { useSendDialog } from '../context';

export const Recipient: React.FC = () => {
  const {
    onNext,
    onPrevious,
    initialize,
    transaction,
    selectedAccount,
    isAccountSelectionDisabled,
  } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const theme = useTheme();
  const displayText = lang.strings.send.recipient;

  const getBalanceToDisplay = () => {
    const account = selectedAccount;
    if (!account) return `0`;
    const { amount: _amount, unit } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: account.assetId,
      unitAbbr:
        account.unit ??
        getDefaultUnit(account.parentAssetId, account.assetId).abbr,
      amount: account.balance,
    });
    return `${_amount} ${unit.abbr}`;
  };

  const [btnState, handleButtonState] = useState(false);
  useEffect(() => {
    handleButtonState(
      !!transaction &&
        transaction.validation.hasEnoughBalance &&
        !(transaction.validation as IPreparedBtcTransaction['validation'])
          .isNotOverDustThreshold &&
        transaction.validation.outputs.length > 0 &&
        transaction.validation.outputs.every(output => output) &&
        transaction.userInputs.outputs.every(
          output =>
            output.address !== '' && !new BigNumber(output.amount).isNaN(),
        ) &&
        transaction.validation.isValidFee,
    );
  }, [transaction]);

  useEffect(() => {
    initialize();
  }, []);

  if (transaction === undefined) return <LoaderDialog />;

  return (
    <DialogBox width={517} $maxHeight="full">
      <DialogBoxBody pt={4} pb={0}>
        <BlockchainIcon />
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
          disabledInnerFlex
        />
      </DialogBoxBody>
      <ScrollableContainer>
        <AddressAndAmountSection disableInputs={isAccountSelectionDisabled} />
        <FeeSection showErrors={isAccountSelectionDisabled} />
      </ScrollableContainer>
      <DialogBoxFooter>
        {!isAccountSelectionDisabled && (
          <Button
            variant="secondary"
            onClick={() => {
              onPrevious();
            }}
          >
            <LangDisplay text={button.back} />
          </Button>
        )}
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

Recipient.defaultProps = {
  hideBackButton: undefined,
  disableInputs: undefined,
};
