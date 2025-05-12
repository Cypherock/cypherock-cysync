import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { IPreparedSolanaTransaction } from '@cypherock/coin-support-solana';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { IPreparedXrpTransaction } from '@cypherock/coin-support-xrp';
import {
  BlockchainIcon,
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
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React, { useCallback, useEffect, useState } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

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
    isPreparingTxn,
    providerName,
  } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const theme = useTheme();
  const displayText = lang.strings.send.recipient;

  const getBalanceToDisplay = () => {
    const account = selectedAccount;
    if (!account) return `0`;

    const balance = account.spendableBalance ?? account.balance;

    const { amount: _amount, unit } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: account.assetId,
      unitAbbr:
        account.unit ??
        getDefaultUnit(account.parentAssetId, account.assetId).abbr,
      amount: balance,
    });
    return `${_amount} ${unit.abbr}`;
  };

  const [btnState, handleButtonState] = useState(false);
  useEffect(() => {
    const areUserOutputsValid = (
      validation: IPreparedTransaction['validation'],
    ): boolean =>
      validation.outputs.length > 0 &&
      validation.outputs.every(output => output) &&
      !!transaction &&
      transaction.userInputs.outputs.every(
        output =>
          output.address !== '' && !new BigNumber(output.amount).isNaN(),
      ) &&
      transaction.validation.ownOutputAddressNotAllowed.every(
        output => !output,
      );

    const isBtcValid = (
      validation: IPreparedBtcTransaction['validation'],
    ): boolean => !validation.isNotOverDustThreshold;

    const isXrpValid = (
      validation: IPreparedXrpTransaction['validation'],
    ): boolean =>
      !validation.isBalanceBelowXrpReserve &&
      !validation.isAmountBelowXrpReserve &&
      !validation.isFeeBelowMin &&
      !validation.isInvalidDestinationTag;

    const isSolanaValid = (
      validation: IPreparedSolanaTransaction['validation'],
    ): boolean => !validation.isAmountBelowRentExempt;

    const isTransactionValid = (): boolean => {
      if (!transaction) return false;

      const v = transaction.validation;
      return (
        v.hasEnoughBalance &&
        v.isValidFee &&
        !v.zeroAmountNotAllowed &&
        areUserOutputsValid(v) &&
        isBtcValid(v as IPreparedBtcTransaction['validation']) &&
        isXrpValid(v as IPreparedXrpTransaction['validation']) &&
        isSolanaValid(v as IPreparedSolanaTransaction['validation'])
      );
    };

    handleButtonState(!isPreparingTxn && isTransactionValid());
  }, [transaction, isPreparingTxn]);

  useEffect(() => {
    initialize();
  }, []);

  const handleSubmit = useCallback(() => {
    logger.info('Form Submit: Recipient', {
      source: `Send/${Recipient.name}`,
      transaction: structuredClone(transaction),
    });
    onNext();
  }, [onNext, transaction]);

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
        {!isAccountSelectionDisabled && (
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
            altText={`~${getBalanceToDisplay()}`}
            textVariant="span"
            fontSize={12}
            disabledInnerFlex
          />
        )}
      </DialogBoxBody>
      <ScrollableContainer>
        <AddressAndAmountSection
          disableInputs={isAccountSelectionDisabled}
          providerName={providerName}
        />
        <FeeSection
          hideSlider={isAccountSelectionDisabled}
          showErrors={isAccountSelectionDisabled}
        />
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
        <Button variant="primary" disabled={!btnState} onClick={handleSubmit}>
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
