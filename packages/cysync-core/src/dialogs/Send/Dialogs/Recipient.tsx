import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { IPreparedSolanaTransaction } from '@cypherock/coin-support-solana';
import { IPreparedStellarTransaction } from '@cypherock/coin-support-stellar';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { IPreparedXrpTransaction } from '@cypherock/coin-support-xrp';
import { IPreparedSiaTransaction } from '@cypherock/coin-support-sia';
import { coinFamiliesMap, CoinFamily, coinList } from '@cypherock/coins';
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
  MessageBox,
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
    selectedAccountParent,
    getComputedFee,
  } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const theme = useTheme();
  const displayText = lang.strings.send.recipient;
  const [showParentBalanceWarning, setShowParentBalanceWarning] =
    useState(false);
  const [minParentBalance, setMinParentBalance] = useState<string>('0');

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
    ): boolean =>
      !(
        validation?.isNotOverDustThreshold?.length > 0 &&
        validation.isNotOverDustThreshold.every(value => value)
      );

    const isXrpValid = (
      validation: IPreparedXrpTransaction['validation'],
    ): boolean =>
      !validation.isBalanceBelowXrpReserve &&
      !validation.isAmountBelowXrpReserve &&
      !validation.isFeeBelowMin &&
      !validation.isInvalidDestinationTag;

    const isStellarValid = (
      validation: IPreparedStellarTransaction['validation'],
    ): boolean =>
      !validation.isBalanceBelowStellarReserve &&
      !validation.isAmountBelowStellarReserve &&
      !validation.isFeeBelowMin &&
      !validation.isInvalidMemo;

    const isSiaValid = (
      validation: IPreparedSiaTransaction['validation'],
    ): boolean =>
      validation.hasEnoughBalance &&
      validation.isValidFee &&
      !validation.zeroAmountNotAllowed;

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
        isStellarValid(v as IPreparedStellarTransaction['validation']) &&
        isSolanaValid(v as IPreparedSolanaTransaction['validation']) &&
        isSiaValid(v as IPreparedSiaTransaction['validation'])
      );
    };

    handleButtonState(!isPreparingTxn && isTransactionValid());
  }, [transaction, isPreparingTxn]);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (selectedAccount && selectedAccountParent && transaction) {
      const parentBalance = selectedAccountParent?.balance ?? '0';
      const computedFee = getComputedFee(
        selectedAccount.familyId as CoinFamily,
        transaction,
      );
      setShowParentBalanceWarning(
        new BigNumber(parentBalance).isLessThanOrEqualTo(
          new BigNumber(computedFee),
        ),
      );
      const { amount: minParsedAmount, unit } = getParsedAmount({
        coinId: selectedAccountParent.parentAssetId,
        assetId: selectedAccountParent.assetId,
        unitAbbr: getDefaultUnit(
          selectedAccountParent.parentAssetId,
          selectedAccountParent.assetId,
        ).abbr,
        amount: computedFee,
      });
      setMinParentBalance(`${minParsedAmount} ${unit.abbr}`);
    }
  }, [selectedAccount, selectedAccountParent, transaction]);

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
        {showParentBalanceWarning && selectedAccountParent && (
          <Container px={5}>
            <MessageBox
              type="warning"
              text={lang.strings.send.recipient.parentAssetInsufficient}
              variables={{
                minParentBalance,
                network: coinList[selectedAccountParent.parentAssetId].name,
                unit: coinList[selectedAccountParent.parentAssetId].abbr,
              }}
            />
          </Container>
        )}
        <AddressAndAmountSection
          disableInputs={isAccountSelectionDisabled}
          providerName={providerName}
        />
        {selectedAccount?.familyId !== coinFamiliesMap.canton && (
          <FeeSection
            hideSlider={isAccountSelectionDisabled}
            showErrors={isAccountSelectionDisabled}
          />
        )}
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
