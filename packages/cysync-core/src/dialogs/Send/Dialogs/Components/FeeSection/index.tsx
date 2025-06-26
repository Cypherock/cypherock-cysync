import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';
import { IPreparedSolanaTransaction } from '@cypherock/coin-support-solana';
import { IPreparedTronTransaction } from '@cypherock/coin-support-tron';
import {
  convertToUnit,
  getDefaultUnit,
  getParsedAmount,
  getZeroUnit,
  formatDisplayPrice,
} from '@cypherock/coin-support-utils';
import { IPreparedXrpTransaction } from '@cypherock/coin-support-xrp';
import {
  CoinFamily,
  EvmIdMap,
  coinFamiliesMap,
  coinList,
} from '@cypherock/coins';
import { Container, MessageBox } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

import { CoinIcon } from '~/components';
import { useLabelSuffix } from '~/dialogs/Send/hooks';
import { useStateToRef } from '~/hooks';
import {
  ILangState,
  selectLanguage,
  selectPriceInfos,
  useAppSelector,
} from '~/store';

import { BitcoinInput } from './BitcoinInput';
import { EthereumInput } from './EthereumInput';
import { FeesDisplay } from './FeesDisplay';
import { FeesHeader } from './FeesHeader';
import { OptimismFeesHeader } from './OptimismFeesHeader';
import { XrpInput } from './XrpInput';

import { useSendDialog } from '../../../context';

const feeInputMap: Partial<Record<CoinFamily, React.FC<any>>> = {
  bitcoin: BitcoinInput,
  evm: EthereumInput,
  xrp: XrpInput,
};
const getDefaultHeader = () => FeesHeader;
const getEvmHeader = (assetId?: string) => {
  if (EvmIdMap.optimism === assetId) return OptimismFeesHeader;
  return FeesHeader;
};

const feeHeaderMap: Partial<
  Record<CoinFamily, (assetId?: string) => React.FC<any>>
> = {
  bitcoin: getDefaultHeader,
  evm: getEvmHeader,
  xrp: getDefaultHeader,
};

const getErrorAndWarningComponents = (
  txnValidation: IPreparedTransaction['validation'],
  isFeeLow: boolean,
  lang: ILangState,
  showErrors?: boolean,
) => {
  const tronTxnValidation =
    txnValidation as IPreparedTronTransaction['validation'];
  const xrpTxnValidation =
    txnValidation as IPreparedXrpTransaction['validation'];
  const solanaTxnValidation =
    txnValidation as IPreparedSolanaTransaction['validation'];

  const displayText = lang.strings.send.recipient;

  return (
    <>
      {isFeeLow && txnValidation.isValidFee && (
        <MessageBox type="warning" text={displayText.warning} />
      )}
      {tronTxnValidation.notEnoughEnergy && (
        <MessageBox
          type="warning"
          text={lang.strings.send.tron.notEnoughEnergyWarning}
        />
      )}
      {!txnValidation.isValidFee && (
        <MessageBox type="danger" text={displayText.feeError} />
      )}
      {xrpTxnValidation.isFeeBelowMin && (
        <MessageBox type="danger" text={displayText.feeBelowMinError} />
      )}
      {solanaTxnValidation.isRentExemptFeeRequired && (
        <MessageBox type="warning" text={displayText.rentExemptFeeWarning} />
      )}
      {showErrors && !txnValidation.hasEnoughBalance && (
        <MessageBox type="danger" text={displayText.notEnoughBalance} />
      )}
    </>
  );
};

export interface FeeSectionProps {
  showErrors?: boolean;
  hideSlider?: boolean;
}

export const FeeSection: React.FC<FeeSectionProps> = ({
  showErrors,
  hideSlider,
}) => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const { transaction, selectedAccount, prepare, getComputedFee } =
    useSendDialog();
  const transactionRef = useStateToRef({ transaction });
  const [isFeeLow, setIsFeeLow] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [isFeeLoading, setIsFeeLoading] = useState(false);

  const getLabelSuffix = useLabelSuffix();
  const getBitcoinProps = () => {
    const { feesUnit } = coinList[selectedAccount?.assetId ?? ''];
    const txn = transaction as IPreparedBtcTransaction;
    return {
      isTextInput,
      unit: feesUnit,
      initialValue: txn.staticData.averageFee,
      onChange: debouncedPrepareFeeChanged,
    };
  };

  const getEthereumProps = () => {
    if (!selectedAccount) return {};
    const { feesUnit } = coinList[selectedAccount.parentAssetId];
    const txn = transaction as IPreparedEvmTransaction;
    const { amount, unit } = getParsedAmount({
      coinId: selectedAccount.parentAssetId,
      amount: txn.staticData.averageGasPrice,
      unitAbbr: feesUnit || 'Gwei',
    });
    const inputGasPrice = getParsedAmount({
      coinId: selectedAccount.parentAssetId,
      amount: txn.userInputs.gasPrice ?? txn.staticData.averageGasPrice,
      unitAbbr: feesUnit || 'Gwei',
    }).amount;
    return {
      isTextInput,
      unit: unit.abbr,
      initialGasPrice: amount,
      inputGasPrice,
      onChange: debouncedEvmPrepareFeeChanged,
    };
  };

  const getXrpProps = () => {
    let { feesUnit } = coinList[selectedAccount?.assetId ?? ''];
    const txn = transaction as IPreparedXrpTransaction;
    let { fees } = txn.staticData;

    if (selectedAccount) {
      const { amount: convertedFees, unit } = convertToUnit({
        amount: txn.staticData.fees,
        fromUnitAbbr: getZeroUnit(selectedAccount.parentAssetId).abbr,
        coinId: selectedAccount.parentAssetId,
        toUnitAbbr: getDefaultUnit(selectedAccount.parentAssetId).abbr,
      });
      fees = convertedFees;
      feesUnit = unit.abbr;
    }

    return {
      unit: feesUnit,
      initialValue: fees,
      onChange: debouncedXrpPrepareFeeChanged,
    };
  };

  const feeInputPropsMap: Record<CoinFamily, () => Record<string, any>> = {
    bitcoin: getBitcoinProps,
    evm: getEthereumProps,
    near: () => ({}),
    solana: () => ({}),
    tron: () => ({}),
    xrp: getXrpProps,
    starknet: () => ({}),
    icp: () => ({}),
  };

  const getFeeInputComponent = () => {
    if (!selectedAccount || hideSlider) return null;
    const coinFamily = selectedAccount.familyId as CoinFamily;

    const Component = feeInputMap[coinFamily];
    if (!Component) return null;

    const props = feeInputPropsMap[coinFamily]();
    return <Component {...props} />;
  };

  const isToggleAllowed = (coinFamily: CoinFamily) =>
    coinFamily !== coinFamiliesMap.xrp;

  const getFeeHeaderComponent = () => {
    if (!selectedAccount) return null;
    const coinFamily = selectedAccount.familyId as CoinFamily;

    const Component = feeHeaderMap[coinFamily]?.(selectedAccount.parentAssetId);
    if (!Component) return null;

    return (
      <Component
        title={displayText.fees.title}
        initialState={isTextInput}
        onChange={setIsTextInput}
        isToggleButtonHidden={!isToggleAllowed(coinFamily) || hideSlider}
      />
    );
  };

  const prepareFeeChanged = async (value: number) => {
    setIsFeeLoading(true);
    const txn = transactionRef.current.transaction as IPreparedBtcTransaction;
    setIsFeeLow(value < (2 / 3) * txn.staticData.averageFee);
    txn.userInputs.feeRate = value;
    await prepare(txn);
    setIsFeeLoading(false);
  };

  const debouncedPrepareFeeChanged = useCallback(
    lodash.debounce(prepareFeeChanged, 300),
    [],
  );

  const evmPrepareFee = async (param: {
    gasLimit?: number;
    gasPrice?: number;
  }) => {
    setIsFeeLoading(true);
    const txn = transactionRef.current.transaction as IPreparedEvmTransaction;
    let gasPrice = param.gasPrice?.toString(10)
      ? convertToUnit({
          amount: param.gasPrice,
          coinId: selectedAccount?.parentAssetId ?? '',
          fromUnitAbbr: `Gwei`,
          toUnitAbbr: getZeroUnit(selectedAccount?.parentAssetId ?? '').abbr,
        }).amount
      : txn.userInputs.gasPrice;
    if (gasPrice) gasPrice = new BigNumber(gasPrice).toFixed(0);

    const gasLimit = param.gasLimit ?? Number(txn.computedData.gasLimit);

    // the gas price check for 2/3 of the average is same as bitcoin
    setIsFeeLow(
      Number(gasPrice) < (2 / 3) * Number(txn.staticData.averageGasPrice) ||
        gasLimit < Number(txn.computedData.gasLimitEstimate),
    );

    if (param.gasLimit !== undefined) {
      // user modified gas limit
      txn.userInputs.gasLimit = gasLimit.toString(10);
    }
    if (param.gasPrice !== undefined) {
      // user modified gas price
      txn.userInputs.gasPrice = gasPrice;
    }
    await prepare(txn);
    setIsFeeLoading(false);
  };

  const debouncedEvmPrepareFeeChanged = useCallback(
    lodash.debounce(evmPrepareFee, 300),
    [],
  );

  const XrpPrepareFeeChanged = async (value: number) => {
    setIsFeeLoading(true);
    const txn = transactionRef.current.transaction as IPreparedXrpTransaction;
    let fees = value.toString();

    if (selectedAccount) {
      const { amount: convertedFees } = convertToUnit({
        amount: fees,
        fromUnitAbbr: getDefaultUnit(selectedAccount.parentAssetId).abbr,
        coinId: selectedAccount.parentAssetId,
        toUnitAbbr: getZeroUnit(selectedAccount.parentAssetId).abbr,
      });
      fees = convertedFees;
    }

    txn.userInputs.fees = fees;
    await prepare(txn);
    setIsFeeLoading(false);
  };

  const debouncedXrpPrepareFeeChanged = useCallback(
    lodash.debounce(XrpPrepareFeeChanged, 300),
    [],
  );

  const getFeeDetails = () => {
    const result = { fee: '', value: '' };
    const account = selectedAccount;
    if (!account || !transaction) return result;

    const computedFee = getComputedFee(
      account.familyId as CoinFamily,
      transaction,
    );

    const isIcpToken =
      account.familyId === coinFamiliesMap.icp &&
      account.type === AccountTypeMap.subAccount;
    const { amount: _amount, unit } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: isIcpToken ? account.assetId : undefined,
      unitAbbr: getDefaultUnit(
        account.parentAssetId,
        isIcpToken ? account.assetId : undefined,
      ).abbr,
      amount: computedFee,
    });
    result.fee = `${_amount} ${unit.abbr}`;

    const coinPrice = priceInfos.find(
      p =>
        p.assetId === (isIcpToken ? account.assetId : account.parentAssetId) &&
        p.currency.toLowerCase() === 'usd',
    );

    if (coinPrice) {
      const feesInDefaultUnit = convertToUnit({
        amount: computedFee,
        fromUnitAbbr: getZeroUnit(
          account.parentAssetId,
          isIcpToken ? account.assetId : undefined,
        ).abbr,
        coinId: account.parentAssetId,
        assetId: isIcpToken ? account.assetId : undefined,
        toUnitAbbr: getDefaultUnit(
          account.parentAssetId,
          isIcpToken ? account.assetId : undefined,
        ).abbr,
      });
      const feeValue = new BigNumber(feesInDefaultUnit.amount).multipliedBy(
        coinPrice.latestPrice,
      );
      result.value = `$${formatDisplayPrice(feeValue)}`;
    }

    return result;
  };

  const txnValidation = transaction?.validation;

  return (
    <Container
      display="flex"
      direction="column"
      gap={16}
      px={5}
      pb={4}
      width="full"
    >
      {getFeeHeaderComponent()}
      {getFeeInputComponent()}
      <FeesDisplay
        label={displayText.fees.label + getLabelSuffix(selectedAccount)}
        isLoading={isFeeLoading}
        image={
          <CoinIcon parentAssetId={selectedAccount?.parentAssetId ?? ''} />
        }
        {...getFeeDetails()}
      />
      ...
      {txnValidation &&
        getErrorAndWarningComponents(txnValidation, isFeeLow, lang, showErrors)}
    </Container>
  );
};

FeeSection.defaultProps = {
  showErrors: undefined,
  hideSlider: undefined,
};
