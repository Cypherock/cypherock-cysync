import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  BlockchainIcon,
  Button,
  CustomInputSend,
  DoubleArrow,
  FeesSlider,
  Flex,
  InformationIcon,
  Input,
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

const INFO_NOTE_STYLE: React.CSSProperties = {
  background: 'rgba(196,146,42,0.08)',
  border: '1px solid rgba(196,146,42,0.2)',
  borderRadius: 8,
  padding: '10px 14px',
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

const parseAccountBalanceRaw = (
  account: AccountLike | null | undefined,
): string => {
  if (!account) return '';
  try {
    const { amount: bal } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: account.assetId,
      unitAbbr: getDefaultUnit(account.parentAssetId, account.assetId).abbr,
      amount: account.balance,
    });
    return bal;
  } catch {
    return '';
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

type Price = ReturnType<typeof findPrice>;

const findFeePayingAccount = (
  isPol: boolean,
  allAccounts: ReturnType<typeof useAccounts>,
  selectedAccount: EverstakeCtx['selectedAccount'],
) => {
  if (!isPol) return selectedAccount;
  if (!selectedAccount) return undefined;
  return allAccounts.find(
    acc =>
      acc.walletId === selectedAccount.walletId &&
      acc.assetId === acc.parentAssetId &&
      acc.parentAssetId === selectedAccount.parentAssetId,
  );
};

const parseMaxUnstake = (raw: string | null | undefined): string => {
  if (!raw) return '';
  try {
    const active = new BigNumber(raw || '0');
    if (active.isZero() || active.isNaN()) return '0';
    return parseFloat(active.toFixed(6, BigNumber.ROUND_FLOOR)).toString();
  } catch {
    return '';
  }
};

const toUsd = (ethAmount: string, price: Price): string => {
  if (!price || !ethAmount || ethAmount === '0') return '';
  const usd = new BigNumber(ethAmount).multipliedBy(price);
  return usd.isNaN() ? '' : `≈ $${usd.toFixed(2)}`;
};

const withLeadingSpace = (text: string): string => (text ? ` ${text}` : '');

const amountToUsd = (amount: string, price: Price): string =>
  amount && price ? new BigNumber(amount).multipliedBy(price).toFixed(2) : '';

const usdToAmount = (usd: string, price: NonNullable<Price>): string =>
  usd ? new BigNumber(usd).dividedBy(price).toFixed(6) : '';

const isAmountPositive = (amount: string): boolean =>
  !!amount && parseFloat(amount) > 0;

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

const isAmountBelowMin = (amount: string, minStakeAmount: string): boolean =>
  isAmountPositive(amount) &&
  new BigNumber(amount).isLessThan(new BigNumber(minStakeAmount));

const isAmountOverMax = (amount: string, maxUnstake: string): boolean =>
  !!amount &&
  !!maxUnstake &&
  new BigNumber(amount).isGreaterThan(new BigNumber(maxUnstake));

const getAverageGwei = (txn: EverstakeCtx['unstakeTxn']): number =>
  txn ? Number((txn as any).staticData?.averageGasPrice) / 1e9 : 1;

const getDisplayFee = (
  txn: EverstakeCtx['unstakeTxn'],
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
  feeDecimal: string;
  feePayingBalanceRaw: string;
}): boolean => {
  const { isFeeStep, hasTxn, feeDecimal, feePayingBalanceRaw } = params;
  if (!isFeeStep || !hasTxn || !feePayingBalanceRaw) return false;
  return new BigNumber(feeDecimal).isGreaterThan(
    new BigNumber(feePayingBalanceRaw),
  );
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

const UnstakeTitle: React.FC<{
  isFeeStep: boolean;
  unstakeAmount: string;
  unitAbbr: string;
}> = ({ isFeeStep, unstakeAmount, unitAbbr }) => (
  <Flex direction="column" gap={4} align="center">
    <BlockchainIcon />
    <Typography variant="h5" $textAlign="center" $fontSize={22}>
      {isFeeStep
        ? `Unstaking ${unstakeAmount} ${unitAbbr}`
        : `Unstake ${unitAbbr}`}
    </Typography>
    {!isFeeStep && (
      <Typography
        variant="span"
        color="muted"
        $fontSize={14}
        $textAlign="center"
      >
        Withdraw from your active staking position
      </Typography>
    )}
  </Flex>
);

const UnstakeMaxToggle: React.FC<{
  hasAccount: boolean;
  unstakeMax: boolean;
  onToggle: (checked: boolean) => void;
}> = ({ hasAccount, unstakeMax, onToggle }) => (
  <Flex align="center" gap={8}>
    <Typography variant="span" color="muted" $fontSize={13}>
      Max
    </Typography>
    {hasAccount ? (
      <Toggle checked={unstakeMax} onToggle={onToggle} />
    ) : (
      <Toggle checked={false} />
    )}
  </Flex>
);

const AmountInputs: React.FC<{
  unstakeAmount: string;
  usdInput: string;
  ethPrice: Price;
  unitAbbr: string;
  disabled: boolean;
  onAmountChange: (val: string) => void;
  onUsdChange: (val: string) => void;
}> = ({
  unstakeAmount,
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
        name="everstake-unstake-amount"
        placeholder="0"
        onChange={onAmountChange}
        value={unstakeAmount}
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
            name="everstake-unstake-amount-usd"
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
  maxUnstake: string;
  maxUsdSuffix: string;
  amountBelowMin: boolean;
  amountExceedsMax: boolean;
  hasActiveUnbond: boolean;
  minStakeAmount: string;
  unitAbbr: string;
}> = ({
  isFeeStep,
  maxUnstake,
  maxUsdSuffix,
  amountBelowMin,
  amountExceedsMax,
  hasActiveUnbond,
  minStakeAmount,
  unitAbbr,
}) => {
  if (isFeeStep) return null;
  return (
    <>
      {maxUnstake ? (
        <Typography variant="span" color="muted" $fontSize={12}>
          Available to unstake: {maxUnstake} {unitAbbr}
          {maxUsdSuffix}
        </Typography>
      ) : null}
      {amountBelowMin ? (
        <Typography variant="span" color="error" $fontSize={12}>
          Minimum unstake is {minStakeAmount} {unitAbbr}
        </Typography>
      ) : null}
      {amountExceedsMax ? (
        <Typography variant="span" color="error" $fontSize={12}>
          Amount exceeds your staked balance
        </Typography>
      ) : null}
      {hasActiveUnbond ? (
        <Typography variant="span" color="error" $fontSize={12}>
          You already have an unbonding request in progress. Claim it before
          starting a new unstake.
        </Typography>
      ) : null}
    </>
  );
};

const UnstakeNotes: React.FC<{
  isFeeStep: boolean;
  isPol: boolean;
  exceedsInterchangeAllowed: boolean;
  unitAbbr: string;
}> = ({ isFeeStep, isPol, exceedsInterchangeAllowed, unitAbbr }) => {
  if (isFeeStep) return null;
  return (
    <>
      {isPol && (
        <div style={INFO_NOTE_STYLE}>
          <span
            style={{
              color: '#C4922A',
              lineHeight: 1.6,
              display: 'block',
              fontSize: 12,
            }}
          >
            {`After unstaking, your ${unitAbbr} enters an ~80 checkpoint unbonding period (roughly 3-4 days). Once complete, you can claim it back to your wallet.`}
          </span>
        </div>
      )}
      {exceedsInterchangeAllowed && (
        <LeanBox
          leftImage={<InformationIcon height={16} width={16} />}
          text="Pool liquidity is insufficient for an instant unstake. Your ETH will enter a processing queue and become claimable once cleared."
          textVariant="span"
          fontSize={12}
          disabledInnerFlex
        />
      )}
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
  sliderValue: number;
  averageGwei: number;
  feeLabel: string;
  insufficientForFee: boolean;
  onGasPriceChange: EverstakeCtx['setCustomGasPrice'];
}> = ({
  isFeeLoading,
  hasTxn,
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
          Not enough ETH in this wallet to cover the network fee.
        </Typography>
      ) : null}
    </Flex>
  );
};

export const EverstakeUnstake: React.FC = () => {
  const {
    selectedAccount,
    unstakeAmount,
    setUnstakeAmount,
    onProceed,
    unstakeTxn,
    step,
    isFeeLoading,
    customGasPrice,
    setCustomGasPrice,
    onClose,
    minStakeAmount,
    userPosition,
    polPosition,
    isPol,
    unitAbbr,
    isProceeding,
    poolInfo,
  } = useEverstake();

  const allAccounts = useAccounts();

  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );

  const [unstakeMax, setUnstakeMax] = useState(false);
  const [usdInput, setUsdInput] = useState('');
  const lastEditedRef = useRef<'token' | 'usd' | null>(null);

  const isFeeStep = step === 'unstakeFee';

  const maxUnstake = useMemo(
    () =>
      parseMaxUnstake(
        isPol
          ? polPosition?.stakedBalance
          : userPosition?.autocompoundBalanceOf,
      ),
    [isPol, userPosition, polPosition],
  );

  const hasActiveUnbond = isPol && !!polPosition?.unbonding;

  const coinId = selectedAccount?.parentAssetId ?? '';
  const ethPrice = findPrice(priceInfos, selectedAccount);

  const feePayingAccount = useMemo(
    () => findFeePayingAccount(isPol, allAccounts, selectedAccount),
    [isPol, allAccounts, selectedAccount],
  );

  const feePayingBalanceRaw = parseAccountBalanceRaw(feePayingAccount);

  useEffect(() => {
    if (lastEditedRef.current === 'usd') return;
    setUsdInput(amountToUsd(unstakeAmount, ethPrice));
  }, [unstakeAmount, ethPrice]);

  const exceedsInterchangeAllowed = isOverInterchange(
    isPol,
    unstakeAmount,
    poolInfo,
  );
  const amountBelowMin = isAmountBelowMin(unstakeAmount, minStakeAmount);
  const amountExceedsMax = isAmountOverMax(unstakeAmount, maxUnstake);

  const handleToggleMax = (checked: boolean) => {
    lastEditedRef.current = 'token';
    setUnstakeMax(checked);
    if (checked) setUnstakeAmount(maxUnstake);
  };

  const handleAmountChange = (val: string) => {
    lastEditedRef.current = 'token';
    setUnstakeAmount(sanitizeAmountInput(val, MAX_TOKEN_DECIMALS));
    if (unstakeMax) setUnstakeMax(false);
  };

  const handleUsdChange = (val: string) => {
    if (!ethPrice) return;
    lastEditedRef.current = 'usd';
    const filtered = sanitizeAmountInput(val, MAX_USD_DECIMALS);
    setUsdInput(filtered);
    setUnstakeAmount(usdToAmount(filtered, ethPrice));
    if (unstakeMax) setUnstakeMax(false);
  };

  const canProceed =
    !!selectedAccount &&
    isAmountPositive(unstakeAmount) &&
    !amountExceedsMax &&
    !amountBelowMin &&
    !hasActiveUnbond;

  const averageGwei = getAverageGwei(unstakeTxn);
  const sliderValue = customGasPrice ?? averageGwei;

  const displayFee = getDisplayFee(unstakeTxn, averageGwei, sliderValue);
  const feeLabel = formatFee(displayFee, coinId);
  const feeDecimal = parseFeeDecimal(displayFee, coinId);

  const insufficientForFee = hasInsufficientFee({
    isFeeStep,
    hasTxn: !!unstakeTxn,
    feeDecimal,
    feePayingBalanceRaw,
  });

  const inputsDisabled = !selectedAccount || unstakeMax || isFeeStep;

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
      <UnstakeTitle
        isFeeStep={isFeeStep}
        unstakeAmount={unstakeAmount}
        unitAbbr={unitAbbr}
      />

      {/* Fields — dimmed on fee step */}
      <Flex direction="column" gap={20} opacity={isFeeStep ? 0.5 : 1}>
        {/* Amount */}
        <Flex direction="column" gap={8} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Typography variant="span" color="muted" $fontSize={13}>
              Enter Amount
            </Typography>
            {!isFeeStep && (
              <UnstakeMaxToggle
                hasAccount={!!selectedAccount}
                unstakeMax={unstakeMax}
                onToggle={handleToggleMax}
              />
            )}
          </Flex>
          <AmountInputs
            unstakeAmount={unstakeAmount}
            usdInput={usdInput}
            ethPrice={ethPrice}
            unitAbbr={unitAbbr}
            disabled={inputsDisabled}
            onAmountChange={handleAmountChange}
            onUsdChange={handleUsdChange}
          />
          <AmountMessages
            isFeeStep={isFeeStep}
            maxUnstake={maxUnstake}
            maxUsdSuffix={withLeadingSpace(toUsd(maxUnstake, ethPrice))}
            amountBelowMin={amountBelowMin}
            amountExceedsMax={amountExceedsMax}
            hasActiveUnbond={hasActiveUnbond}
            minStakeAmount={minStakeAmount}
            unitAbbr={unitAbbr}
          />
        </Flex>

        {/* Info note */}
        <UnstakeNotes
          isFeeStep={isFeeStep}
          isPol={isPol}
          exceedsInterchangeAllowed={exceedsInterchangeAllowed}
          unitAbbr={unitAbbr}
        />
      </Flex>

      {/* Fee section */}
      {isFeeStep && (
        <FeeSection
          isFeeLoading={isFeeLoading}
          hasTxn={!!unstakeTxn}
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
          {isFeeStep ? 'Confirm Unstake' : 'Proceed'}
        </Button>
      </Flex>
    </div>
  );
};
