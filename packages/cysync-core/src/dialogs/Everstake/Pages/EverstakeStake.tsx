import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  BlockchainIcon,
  Button,
  CustomInputSend,
  DoubleArrow,
  Dropdown,
  FeesSlider,
  Flex,
  Input,
  InformationIcon,
  LeanBox,
  Throbber,
  Toggle,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useEverstake } from '~/context/everstake';
import { useCurrency } from '~/context';
import { useAccounts } from '~/hooks';
import { selectCurrentCurrencyPriceInfos, useAppSelector } from '~/store';

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: 500,
  borderRadius: 16,
  border: '1px solid #2C2520',
  background: 'linear-gradient(180deg, #211C18 0%, #211A16 50%, #252219 100%)',
  boxShadow: '4px 4px 32px 4px #0F0D0B',
  padding: 32,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const STAKE_PERCENTAGE_OPTIONS = [25, 50, 75];

const MAX_INTEGER_DIGITS = 15;
const MAX_TOKEN_DECIMALS = 18; // same as on-chain wei precision for ETH/POL
const MAX_USD_DECIMALS = 2;

const sanitizeAmountInput = (val: string, maxDecimals: number): string => {
  const cleaned = val.replace(/[^0-9.]/g, '');
  const firstDot = cleaned.indexOf('.');
  if (firstDot === -1) return cleaned.slice(0, MAX_INTEGER_DIGITS);
  const intPart = cleaned.slice(0, firstDot).slice(0, MAX_INTEGER_DIGITS);
  const decPart = cleaned
    .slice(firstDot + 1)
    .replace(/\./g, '')
    .slice(0, maxDecimals);
  return `${intPart}.${decPart}`;
};

const formatFee = (fee: string | undefined, coinId: string): string => {
  if (!fee || fee === '0') return '';
  try {
    const { amount, unit } = getParsedAmount({
      coinId,
      unitAbbr: getDefaultUnit(coinId).abbr,
      amount: fee,
    });
    return `${amount} ${unit.abbr}`;
  } catch {
    return '';
  }
};

type EverstakeCtx = ReturnType<typeof useEverstake>;

interface AccountLike {
  parentAssetId: string;
  assetId: string;
  balance: string;
}

const parseAccountBalance = (
  account: AccountLike | null | undefined,
): { display: string; raw: string } => {
  if (!account) return { display: '', raw: '' };
  try {
    const { amount: bal, unit } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: account.assetId,
      unitAbbr: getDefaultUnit(account.parentAssetId, account.assetId).abbr,
      amount: account.balance,
    });
    return { display: `Available: ${bal} ${unit.abbr}`, raw: bal };
  } catch {
    return { display: '', raw: '' };
  }
};

const findPrice = (
  priceInfos: ReturnType<typeof selectCurrentCurrencyPriceInfos>,
  selectedAccount: EverstakeCtx['selectedAccount'],
) => {
  if (!selectedAccount) return undefined;
  return priceInfos.find(p => p.assetId === selectedAccount.assetId)
    ?.latestPrice;
};

const findSiblingAccount = (
  allAccounts: ReturnType<typeof useAccounts>,
  selectedAccount: EverstakeCtx['selectedAccount'],
) => {
  if (!selectedAccount) return undefined;
  return allAccounts.find(
    acc =>
      acc.walletId === selectedAccount.walletId &&
      acc.assetId === acc.parentAssetId &&
      acc.parentAssetId === selectedAccount.parentAssetId,
  );
};

type Price = ReturnType<typeof findPrice>;

const amountToUsd = (amount: string, price: Price): string =>
  amount && price ? new BigNumber(amount).multipliedBy(price).toFixed(2) : '';

const usdToAmount = (usd: string, price: NonNullable<Price>): string =>
  usd ? new BigNumber(usd).dividedBy(price).toFixed(6) : '';

const isAmountPositive = (amount: string): boolean =>
  !!amount && parseFloat(amount) > 0;

const isAmountOverBalance = (amount: string, balanceRaw: string): boolean =>
  !!amount &&
  !!balanceRaw &&
  new BigNumber(amount).isGreaterThan(new BigNumber(balanceRaw));

const isAmountBelowMin = (amount: string, minStakeAmount: string): boolean =>
  isAmountPositive(amount) &&
  new BigNumber(amount).isLessThan(new BigNumber(minStakeAmount));

const isOverInterchange = (
  isPol: boolean,
  amount: string,
  poolInfo: EverstakeCtx['poolInfo'],
): boolean =>
  !isPol &&
  !!amount &&
  !!poolInfo?.interchangeAllowed &&
  new BigNumber(amount).isGreaterThan(
    new BigNumber(poolInfo.interchangeAllowed),
  );

const getAverageGwei = (txn: EverstakeCtx['stakeTxn']): number =>
  txn ? Number((txn as any).staticData?.averageGasPrice) / 1e9 : 1;

const getDisplayFee = (
  txn: EverstakeCtx['stakeTxn'],
  averageGwei: number,
  sliderValue: number,
): string => {
  const baseFeeWei = txn?.computedData?.fee;
  if (!baseFeeWei || averageGwei === 0) return baseFeeWei ?? '';
  const ratio = sliderValue / averageGwei;
  return new BigNumber(baseFeeWei).multipliedBy(ratio).toFixed(0);
};

const parseFeeDecimal = (raw: string, coinId: string): string => {
  if (!raw || raw === '0') return '0';
  try {
    const { amount: fee } = getParsedAmount({
      coinId,
      unitAbbr: getDefaultUnit(coinId).abbr,
      amount: raw,
    });
    return fee;
  } catch {
    return '0';
  }
};

const hasInsufficientFee = (params: {
  isFeeStep: boolean;
  hasTxn: boolean;
  isPol: boolean;
  amount: string;
  feeDecimal: string;
  siblingBalanceRaw: string;
  balanceRaw: string;
}): boolean => {
  const { isFeeStep, hasTxn, isPol, amount, feeDecimal } = params;
  const { siblingBalanceRaw, balanceRaw } = params;
  if (!isFeeStep || !hasTxn) return false;
  if (isPol) {
    return (
      !!siblingBalanceRaw &&
      new BigNumber(feeDecimal).isGreaterThan(new BigNumber(siblingBalanceRaw))
    );
  }
  return new BigNumber(amount || '0')
    .plus(feeDecimal)
    .isGreaterThan(new BigNumber(balanceRaw || '0'));
};

const isProceedDisabled = (params: {
  isProceeding: boolean;
  isFeeStep: boolean;
  isFeeLoading: boolean;
  insufficientForFee: boolean;
  canProceed: boolean;
}): boolean => {
  const { isProceeding, isFeeStep, isFeeLoading } = params;
  const { insufficientForFee, canProceed } = params;
  if (isProceeding) return true;
  return isFeeStep ? isFeeLoading || insufficientForFee : !canProceed;
};

const getAccountLabel = (assetConfig: EverstakeCtx['assetConfig']): string =>
  assetConfig ? `Select ${assetConfig.label} Account` : 'Select Account';

const StakeTitle: React.FC<{
  isFeeStep: boolean;
  amount: string;
  unitAbbr: string;
}> = ({ isFeeStep, amount, unitAbbr }) => (
  <Flex direction="column" gap={4} align="center">
    <BlockchainIcon />
    <Typography variant="h5" $textAlign="center" $fontSize={22}>
      {isFeeStep ? `Staking ${amount} ${unitAbbr}` : `Stake ${unitAbbr}`}
    </Typography>
    {!isFeeStep && (
      <Typography
        variant="span"
        color="muted"
        $fontSize={14}
        $textAlign="center"
      >
        Select wallet and account to continue
      </Typography>
    )}
  </Flex>
);

const StakeMaxToggle: React.FC<{
  hasAccount: boolean;
  stakeMax: boolean;
  onToggle: (checked: boolean) => void;
}> = ({ hasAccount, stakeMax, onToggle }) => (
  <Flex align="center" gap={8}>
    <Typography variant="span" color="muted" $fontSize={13}>
      Stake Max
    </Typography>
    {hasAccount ? (
      <Toggle checked={stakeMax} onToggle={onToggle} />
    ) : (
      <Toggle checked={false} />
    )}
  </Flex>
);

const PercentageButton: React.FC<{
  pct: number;
  isActive: boolean;
  isDisabled: boolean;
  onFill: (pct: number) => void;
}> = ({ pct, isActive, isDisabled, onFill }) => (
  <button
    type="button"
    onClick={() => onFill(pct)}
    disabled={isDisabled}
    style={{
      background: isActive
        ? 'linear-gradient(90deg, #E9B873 0%, #FEDD8F 37.17%, #B78D51 100%)'
        : 'transparent',
      border: 'none',
      color: isActive ? '#1A1612' : '#FFFFFF',
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 9px',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.4 : 1,
    }}
  >
    {pct}%
  </button>
);

const PercentageButtons: React.FC<{
  selectedPercentage: number | null;
  isDisabled: boolean;
  onFill: (pct: number) => void;
}> = ({ selectedPercentage, isDisabled, onFill }) => (
  <div
    style={{
      display: 'flex',
      background: '#000000',
      borderRadius: 6,
      overflow: 'hidden',
    }}
  >
    {STAKE_PERCENTAGE_OPTIONS.map(pct => (
      <PercentageButton
        key={pct}
        pct={pct}
        isActive={selectedPercentage === pct}
        isDisabled={isDisabled}
        onFill={onFill}
      />
    ))}
  </div>
);

const AmountInputs: React.FC<{
  amount: string;
  usdInput: string;
  ethPrice: Price;
  unitAbbr: string;
  disabled: boolean;
  onAmountChange: (val: string) => void;
  onUsdChange: (val: string) => void;
}> = ({
  amount,
  usdInput,
  ethPrice,
  unitAbbr,
  disabled,
  onAmountChange,
  onUsdChange,
}) => (
  <Flex gap={8} align="center" width="full">
    <CustomInputSend>
      <Input
        type="text"
        name="everstake-amount"
        placeholder="0"
        onChange={onAmountChange}
        value={amount}
        disabled={disabled}
        $textColor="white"
        $noBorder
      />
      <Typography $fontSize={16} color="muted" $allowOverflow>
        {unitAbbr}
      </Typography>
    </CustomInputSend>
    {ethPrice && (
      <>
        <DoubleArrow height={22} width={22} />
        <CustomInputSend>
          <Input
            type="text"
            name="everstake-amount-usd"
            placeholder="0"
            onChange={onUsdChange}
            value={usdInput}
            disabled={disabled}
            $textColor="white"
            $noBorder
          />
          <Typography $fontSize={16} color="muted" $allowOverflow>
            USD
          </Typography>
        </CustomInputSend>
      </>
    )}
  </Flex>
);

const AmountMessages: React.FC<{
  isFeeStep: boolean;
  balanceDisplay: string;
  amountBelowMin: boolean;
  amountExceedsBalance: boolean;
  exceedsInterchangeAllowed: boolean;
  isPolKind: boolean;
  minStakeAmount: string;
  unitAbbr: string;
}> = ({
  isFeeStep,
  balanceDisplay,
  amountBelowMin,
  amountExceedsBalance,
  exceedsInterchangeAllowed,
  isPolKind,
  minStakeAmount,
  unitAbbr,
}) => {
  if (isFeeStep) return null;
  return (
    <>
      {balanceDisplay ? (
        <Typography variant="span" color="muted" $fontSize={12}>
          {balanceDisplay}
        </Typography>
      ) : null}
      {amountBelowMin ? (
        <Typography variant="span" color="error" $fontSize={12}>
          Minimum stake is {minStakeAmount} {unitAbbr}
        </Typography>
      ) : null}
      {amountExceedsBalance ? (
        <Typography variant="span" color="error" $fontSize={12}>
          Amount exceeds available balance
        </Typography>
      ) : null}
      {exceedsInterchangeAllowed ? (
        <LeanBox
          leftImage={<InformationIcon height={16} width={16} />}
          text="This may take a few days to a few weeks depending on current network demand."
          textVariant="span"
          fontSize={12}
          disabledInnerFlex
        />
      ) : null}
      {isPolKind ? (
        <Typography variant="span" color="muted" $fontSize={12}>
          If this is your first time staking {unitAbbr}, you may be asked to
          sign an additional approval transaction before staking.
        </Typography>
      ) : null}
    </>
  );
};

const FeeLoading: React.FC = () => (
  <Flex direction="column" align="center" gap={16} py="8px">
    <Throbber size={32} strokeWidth={2} />
    <Typography variant="span" color="muted" $fontSize={13} $textAlign="center">
      Fetching network fees...
    </Typography>
  </Flex>
);

const FeeSection: React.FC<{
  isFeeLoading: boolean;
  hasTxn: boolean;
  isPol: boolean;
  sliderValue: number;
  averageGwei: number;
  feeLabel: string;
  insufficientForFee: boolean;
  onGasPriceChange: EverstakeCtx['setCustomGasPrice'];
}> = ({
  isFeeLoading,
  hasTxn,
  isPol,
  sliderValue,
  averageGwei,
  feeLabel,
  insufficientForFee,
  onGasPriceChange,
}) => {
  if (isFeeLoading) return <FeeLoading />;
  if (!hasTxn) return null;
  return (
    <Flex direction="column" gap={16} width="full">
      <Flex justify="space-between" align="center" width="full">
        <Typography variant="span" color="muted" $fontSize={13}>
          Gas Price
        </Typography>
        <Typography variant="span" $fontSize={13}>
          {sliderValue.toFixed(4)} Gwei
        </Typography>
      </Flex>
      <FeesSlider
        value={sliderValue}
        average={averageGwei}
        onChange={onGasPriceChange}
        captions={[
          { id: 0, name: 'Slow' },
          { id: averageGwei, name: 'Average' },
          { id: averageGwei * 2, name: 'Fast' },
        ]}
      />
      {feeLabel ? (
        <Flex justify="space-between" align="center" width="full">
          <Typography variant="span" color="muted" $fontSize={13}>
            Network Fees
          </Typography>
          <Typography variant="span" $fontSize={13}>
            {feeLabel}
          </Typography>
        </Flex>
      ) : null}
      {insufficientForFee ? (
        <Typography variant="span" color="error" $fontSize={13}>
          {isPol
            ? 'Not enough ETH in this wallet to cover the network fee.'
            : 'Amount plus network fee exceeds your available balance. Lower the amount and try again.'}
        </Typography>
      ) : null}
    </Flex>
  );
};

export const EverstakeStake: React.FC = () => {
  const {
    selectedWallet,
    selectedAccount,
    walletDropdownList,
    accountDropdownList,
    handleWalletChange,
    handleAccountChange,
    amount,
    setAmount,
    onProceed,
    stakeTxn,
    step,
    isFeeLoading,
    customGasPrice,
    setCustomGasPrice,
    onClose,
    minStakeAmount,
    unitAbbr,
    assetConfig,
    isProceeding,
    isPol,
    poolInfo,
  } = useEverstake();

  const allAccounts = useAccounts();

  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );

  const [stakeMax, setStakeMax] = useState(false);
  const [usdInput, setUsdInput] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );
  const lastEditedRef = useRef<'token' | 'usd' | null>(null);

  const coinId = selectedAccount?.parentAssetId ?? '';
  const isFeeStep = step === 'stakeFee';

  const { display: balanceDisplay, raw: balanceRaw } =
    parseAccountBalance(selectedAccount);

  const ethPrice = findPrice(priceInfos, selectedAccount);

  const ethSiblingAccount = useMemo(
    () => findSiblingAccount(allAccounts, selectedAccount),
    [allAccounts, selectedAccount],
  );

  const ethSiblingBalanceRaw = parseAccountBalance(ethSiblingAccount).raw;

  useEffect(() => {
    if (!isPol) setStakeMax(false);
  }, [isPol]);

  useEffect(() => {
    if (lastEditedRef.current === 'usd') return;
    setUsdInput(amountToUsd(amount, ethPrice));
  }, [amount, ethPrice]);

  useEffect(() => {
    setSelectedPercentage(null);
  }, [selectedAccount?.__id]);

  const amountExceedsBalance = isAmountOverBalance(amount, balanceRaw);
  const amountBelowMin = isAmountBelowMin(amount, minStakeAmount);
  const exceedsInterchangeAllowed = isOverInterchange(isPol, amount, poolInfo);

  const handleToggleMax = (checked: boolean) => {
    lastEditedRef.current = 'token';
    setStakeMax(checked);
    if (checked) setAmount(balanceRaw);
  };

  const handleFillPercentage = (pct: number) => {
    if (!balanceRaw) return;
    lastEditedRef.current = 'token';
    setSelectedPercentage(pct);
    const filled = new BigNumber(balanceRaw)
      .multipliedBy(pct / 100)
      .toFixed(MAX_TOKEN_DECIMALS);
    setAmount(sanitizeAmountInput(filled, MAX_TOKEN_DECIMALS));
  };

  const handleAmountChange = (val: string) => {
    lastEditedRef.current = 'token';
    setSelectedPercentage(null);
    setAmount(sanitizeAmountInput(val, MAX_TOKEN_DECIMALS));
    if (stakeMax) setStakeMax(false);
  };

  const handleUsdChange = (val: string) => {
    if (!ethPrice) return;
    lastEditedRef.current = 'usd';
    setSelectedPercentage(null);
    const filtered = sanitizeAmountInput(val, MAX_USD_DECIMALS);
    setUsdInput(filtered);
    setAmount(usdToAmount(filtered, ethPrice));
    if (stakeMax) setStakeMax(false);
  };

  const canProceed =
    !!selectedAccount &&
    isAmountPositive(amount) &&
    !amountExceedsBalance &&
    !amountBelowMin;

  const averageGwei = getAverageGwei(stakeTxn);
  const sliderValue = customGasPrice ?? averageGwei;

  const displayFee = getDisplayFee(stakeTxn, averageGwei, sliderValue);
  const feeLabel = formatFee(displayFee, coinId);
  const feeDecimal = parseFeeDecimal(displayFee, coinId);

  const insufficientForFee = hasInsufficientFee({
    isFeeStep,
    hasTxn: !!stakeTxn,
    isPol,
    amount,
    feeDecimal,
    siblingBalanceRaw: ethSiblingBalanceRaw,
    balanceRaw,
  });

  const hasAccount = !!selectedAccount;
  const inputsDisabled = !selectedAccount || stakeMax || isFeeStep;
  const percentagesDisabled = !selectedAccount || !balanceRaw;

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
      <StakeTitle isFeeStep={isFeeStep} amount={amount} unitAbbr={unitAbbr} />

      {/* Fields — dimmed on fee step */}
      <Flex direction="column" gap={24} opacity={isFeeStep ? 0.5 : 1}>
        {/* Wallet */}
        <Flex direction="column" gap={8} width="full">
          <Typography variant="span" color="muted" $fontSize={13}>
            Select Wallet
          </Typography>
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            onChange={handleWalletChange}
            placeholderText="Choose Wallet"
            searchText=""
            disabled={isFeeStep}
          />
        </Flex>

        {/* Account */}
        <Flex direction="column" gap={8} width="full">
          <Typography variant="span" color="muted" $fontSize={13}>
            {getAccountLabel(assetConfig)}
          </Typography>
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            onChange={handleAccountChange}
            placeholderText="Choose Account"
            searchText=""
            disabled={!selectedWallet || isFeeStep}
          />
        </Flex>

        {/* Amount */}
        <Flex direction="column" gap={8} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Typography variant="span" color="muted" $fontSize={13}>
              Enter Amount
            </Typography>
            {!isFeeStep &&
              (isPol ? (
                <StakeMaxToggle
                  hasAccount={hasAccount}
                  stakeMax={stakeMax}
                  onToggle={handleToggleMax}
                />
              ) : (
                <PercentageButtons
                  selectedPercentage={selectedPercentage}
                  isDisabled={percentagesDisabled}
                  onFill={handleFillPercentage}
                />
              ))}
          </Flex>
          <AmountInputs
            amount={amount}
            usdInput={usdInput}
            ethPrice={ethPrice}
            unitAbbr={unitAbbr}
            disabled={inputsDisabled}
            onAmountChange={handleAmountChange}
            onUsdChange={handleUsdChange}
          />
          <AmountMessages
            isFeeStep={isFeeStep}
            balanceDisplay={balanceDisplay}
            amountBelowMin={amountBelowMin}
            amountExceedsBalance={amountExceedsBalance}
            exceedsInterchangeAllowed={exceedsInterchangeAllowed}
            isPolKind={assetConfig?.kind === 'pol'}
            minStakeAmount={minStakeAmount}
            unitAbbr={unitAbbr}
          />
        </Flex>
      </Flex>

      {/* Fee section */}
      {isFeeStep && (
        <FeeSection
          isFeeLoading={isFeeLoading}
          hasTxn={!!stakeTxn}
          isPol={isPol}
          sliderValue={sliderValue}
          averageGwei={averageGwei}
          feeLabel={feeLabel}
          insufficientForFee={insufficientForFee}
          onGasPriceChange={setCustomGasPrice}
        />
      )}

      {/* Buttons */}
      <Flex gap={16} justify="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={isProceedDisabled({
            isProceeding,
            isFeeStep,
            isFeeLoading,
            insufficientForFee,
            canProceed,
          })}
        >
          {isFeeStep ? 'Confirm Stake' : 'Proceed'}
        </Button>
      </Flex>
    </div>
  );
};
