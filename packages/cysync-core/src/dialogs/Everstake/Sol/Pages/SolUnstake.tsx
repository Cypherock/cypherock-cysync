import {
  BlockchainIcon,
  Button,
  CustomInputSend,
  DoubleArrow,
  Flex,
  Input,
  Toggle,
  Typography,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useCurrency } from '~/context';
import { useSolEverstake } from '~/context/everstake/sol';
import { SOL_MIN_SPLIT_REMAINDER } from '~/context/everstake/sol/types';
import { formatSol, lamportsToSol } from '~/context/everstake/sol/utils';
import { selectCurrentCurrencyPriceInfos, useAppSelector } from '~/store';

import {
  CARD_STYLE,
  INFO_NOTE_STYLE,
  MAX_TOKEN_DECIMALS,
  MAX_USD_DECIMALS,
  sanitizeAmountInput,
} from './shared';
import { SolFeeSection } from './SolFeeSection';

type LastEdited = 'token' | 'usd' | null;

const NOTE_TEXT_STYLE: React.CSSProperties = {
  color: '#C4922A',
  lineHeight: 1.6,
  display: 'block',
  fontSize: 12,
};

const toUsd = (price: string | undefined, solAmount: string): string => {
  if (!price || !solAmount || solAmount === '0') return '';
  const usd = new BigNumber(solAmount).multipliedBy(price);
  return usd.isNaN() ? '' : `≈ $${usd.toFixed(2)}`;
};

const computeUsdInput = (unstakeAmount: string, price: string | undefined) =>
  unstakeAmount && price
    ? new BigNumber(unstakeAmount).multipliedBy(price).toFixed(2)
    : '';

const computeAmountExceedsMax = (unstakeAmount: string, maxUnstake: string) =>
  !!unstakeAmount &&
  !!maxUnstake &&
  new BigNumber(unstakeAmount).isGreaterThan(new BigNumber(maxUnstake));

const computeShowDustWarning = (
  unstakeAmount: string,
  maxUnstake: string,
  hasActiveStake: boolean,
  amountExceedsMax: boolean,
) => {
  // What would stay staked, if the entered amount is valid
  const remainder =
    !!unstakeAmount && hasActiveStake && !amountExceedsMax
      ? new BigNumber(maxUnstake).minus(new BigNumber(unstakeAmount))
      : undefined;

  return (
    !!remainder &&
    remainder.isGreaterThan(0) &&
    remainder.isLessThan(new BigNumber(SOL_MIN_SPLIT_REMAINDER))
  );
};

const computeCanProceed = (
  hasAccount: boolean,
  hasActiveStake: boolean,
  unstakeAmount: string,
  amountExceedsMax: boolean,
) =>
  hasAccount &&
  hasActiveStake &&
  !!unstakeAmount &&
  parseFloat(unstakeAmount) > 0 &&
  !amountExceedsMax;

const computeInsufficientForFee = (
  isFeeStep: boolean,
  isFeeLoading: boolean,
  networkFee: string | undefined,
  balance: string | undefined,
) =>
  isFeeStep &&
  !isFeeLoading &&
  !!networkFee &&
  balance !== undefined &&
  lamportsToSol(networkFee).isGreaterThan(lamportsToSol(balance));

const UnstakeTitle: React.FC<{
  isFeeStep: boolean;
  unstakeAmount: string;
  unitAbbr: string;
  hasWallet: boolean;
}> = ({ isFeeStep, unstakeAmount, unitAbbr, hasWallet }) => (
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
        {hasWallet
          ? 'Enter the amount you want to unstake'
          : 'Select a wallet to continue'}
      </Typography>
    )}
  </Flex>
);

const MaxToggle: React.FC<{
  canToggle: boolean;
  unstakeMax: boolean;
  onToggle: (checked: boolean) => void;
}> = ({ canToggle, unstakeMax, onToggle }) => (
  <Flex align="center" gap={8}>
    <Typography variant="span" color="muted" $fontSize={13}>
      Unstake Max
    </Typography>
    {canToggle ? (
      <Toggle checked={unstakeMax} onToggle={onToggle} />
    ) : (
      <Toggle checked={false} />
    )}
  </Flex>
);

const UnstakeAmountInputs: React.FC<{
  unitAbbr: string;
  price: string | undefined;
  unstakeAmount: string;
  usdInput: string;
  inputsDisabled: boolean;
  unstakeMax: boolean;
  lastEditedRef: React.MutableRefObject<LastEdited>;
  setUnstakeAmount: (val: string) => void;
  setUsdInput: (val: string) => void;
  setUnstakeMax: (val: boolean) => void;
}> = ({
  unitAbbr,
  price,
  unstakeAmount,
  usdInput,
  inputsDisabled,
  unstakeMax,
  lastEditedRef,
  setUnstakeAmount,
  setUsdInput,
  setUnstakeMax,
}) => (
  <Flex gap={8} align="center" width="full">
    <CustomInputSend>
      <Input
        type="text"
        name="everstake-sol-unstake-amount"
        placeholder="0"
        onChange={(val: string) => {
          lastEditedRef.current = 'token';
          setUnstakeAmount(sanitizeAmountInput(val, MAX_TOKEN_DECIMALS));
          if (unstakeMax) setUnstakeMax(false);
        }}
        value={unstakeAmount}
        disabled={inputsDisabled}
        $textColor="white"
        $noBorder
      />
      <Typography $fontSize={16} color="muted" $allowOverflow>
        {unitAbbr}
      </Typography>
    </CustomInputSend>
    {price && (
      <>
        <DoubleArrow height={22} width={22} />
        <CustomInputSend>
          <Input
            type="text"
            name="everstake-sol-unstake-amount-usd"
            placeholder="0"
            onChange={(val: string) => {
              if (!price) return;
              lastEditedRef.current = 'usd';
              const filtered = sanitizeAmountInput(val, MAX_USD_DECIMALS);
              setUsdInput(filtered);
              setUnstakeAmount(
                filtered
                  ? new BigNumber(filtered).dividedBy(price).toFixed(6)
                  : '',
              );
              if (unstakeMax) setUnstakeMax(false);
            }}
            value={usdInput}
            disabled={inputsDisabled}
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

const UnstakeMessages: React.FC<{
  isFeeStep: boolean;
  hasActiveStake: boolean;
  hasPosition: boolean;
  amountExceedsMax: boolean;
  maxUnstake: string;
  maxUsdText: string;
  unitAbbr: string;
}> = ({
  isFeeStep,
  hasActiveStake,
  hasPosition,
  amountExceedsMax,
  maxUnstake,
  maxUsdText,
  unitAbbr,
}) => (
  <>
    {!isFeeStep && hasActiveStake ? (
      <Typography variant="span" color="muted" $fontSize={12}>
        Available to unstake: {maxUnstake} {unitAbbr}
        {maxUsdText ? ` ${maxUsdText}` : ''}
      </Typography>
    ) : null}
    {!isFeeStep && hasPosition && !hasActiveStake ? (
      <Typography variant="span" color="error" $fontSize={12}>
        You have no active stake to unstake.
      </Typography>
    ) : null}
    {!isFeeStep && amountExceedsMax ? (
      <Typography variant="span" color="error" $fontSize={12}>
        Amount exceeds your active stake
      </Typography>
    ) : null}
  </>
);

const UnstakeInfoNotes: React.FC<{
  isFeeStep: boolean;
  showDustWarning: boolean;
  unitAbbr: string;
}> = ({ isFeeStep, showDustWarning, unitAbbr }) => (
  <>
    {!isFeeStep && showDustWarning ? (
      <div style={INFO_NOTE_STYLE}>
        <span style={NOTE_TEXT_STYLE}>
          {`To avoid leaving dust (under ${SOL_MIN_SPLIT_REMAINDER} ${unitAbbr}) in one of your stake accounts, that account will be fully unstaked. This may be slightly more than you entered.`}
        </span>
      </div>
    ) : null}
    {!isFeeStep ? (
      <div style={INFO_NOTE_STYLE}>
        <span style={NOTE_TEXT_STYLE}>
          {`After unstaking, your ${unitAbbr} is ready to claim once the current epoch ends (about 2-3 days). You then claim it back to your wallet. If a stake account is split, a small refundable deposit is set aside for the new account and returned when you claim.`}
        </span>
      </div>
    ) : null}
  </>
);

const UnstakeFeeBlock: React.FC<{
  isFeeLoading: boolean;
  networkFee: string | undefined;
  unitAbbr: string;
  insufficientForFee: boolean;
}> = ({ isFeeLoading, networkFee, unitAbbr, insufficientForFee }) => (
  <Flex direction="column" gap={16} width="full">
    <SolFeeSection
      isLoading={isFeeLoading}
      feeLamports={networkFee}
      unitAbbr={unitAbbr}
    />
    {insufficientForFee ? (
      <Typography variant="span" color="error" $fontSize={13}>
        Not enough SOL in this account to cover the network fee.
      </Typography>
    ) : null}
  </Flex>
);

const isProceedDisabled = (
  isProceeding: boolean,
  isFeeStep: boolean,
  isFeeLoading: boolean,
  insufficientForFee: boolean,
  canProceed: boolean,
) =>
  isProceeding ||
  (isFeeStep ? isFeeLoading || insufficientForFee : !canProceed);

export const SolUnstake: React.FC = () => {
  const {
    selectedAccount,
    unstakeAmount,
    setUnstakeAmount,
    onProceed,
    step,
    isFeeLoading,
    networkFee,
    onClose,
    position,
    unitAbbr,
    isProceeding,
    selectedWallet,
  } = useSolEverstake();

  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );

  const [unstakeMax, setUnstakeMax] = useState(false);
  const [usdInput, setUsdInput] = useState('');
  const lastEditedRef = useRef<LastEdited>(null);

  const isFeeStep = step === 'unstakeReview';

  // Only the active bucket can be unstaked, and only its delegated stake
  // (the refundable deposit held in each account is not unstakeable)
  const maxUnstake = useMemo(
    () => (position ? formatSol(position.active.stakeLamports, 9) : ''),
    [position],
  );

  const price = priceInfos.find(
    p => selectedAccount && p.assetId === selectedAccount.assetId,
  )?.latestPrice;

  useEffect(() => {
    if (lastEditedRef.current === 'usd') return;
    setUsdInput(computeUsdInput(unstakeAmount, price));
  }, [unstakeAmount, price]);

  const hasActiveStake = !!maxUnstake && maxUnstake !== '0';
  const amountExceedsMax = computeAmountExceedsMax(unstakeAmount, maxUnstake);
  const showDustWarning = computeShowDustWarning(
    unstakeAmount,
    maxUnstake,
    hasActiveStake,
    amountExceedsMax,
  );

  const handleToggleMax = (checked: boolean) => {
    lastEditedRef.current = 'token';
    setUnstakeMax(checked);
    if (checked) setUnstakeAmount(maxUnstake);
  };

  const canProceed = computeCanProceed(
    !!selectedAccount,
    hasActiveStake,
    unstakeAmount,
    amountExceedsMax,
  );

  const insufficientForFee = computeInsufficientForFee(
    isFeeStep,
    isFeeLoading,
    networkFee,
    selectedAccount?.balance,
  );

  const inputsDisabled =
    !selectedAccount || !hasActiveStake || unstakeMax || isFeeStep;

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
      <UnstakeTitle
        isFeeStep={isFeeStep}
        unstakeAmount={unstakeAmount}
        unitAbbr={unitAbbr}
        hasWallet={!!selectedWallet}
      />

      {/* Amount — dimmed on fee step */}
      <Flex direction="column" gap={24} opacity={isFeeStep ? 0.5 : 1}>
        <Flex direction="column" gap={8} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Typography variant="span" color="muted" $fontSize={13}>
              Enter Amount
            </Typography>
            {!isFeeStep && (
              <MaxToggle
                canToggle={!!selectedAccount && hasActiveStake}
                unstakeMax={unstakeMax}
                onToggle={handleToggleMax}
              />
            )}
          </Flex>
          <UnstakeAmountInputs
            unitAbbr={unitAbbr}
            price={price}
            unstakeAmount={unstakeAmount}
            usdInput={usdInput}
            inputsDisabled={inputsDisabled}
            unstakeMax={unstakeMax}
            lastEditedRef={lastEditedRef}
            setUnstakeAmount={setUnstakeAmount}
            setUsdInput={setUsdInput}
            setUnstakeMax={setUnstakeMax}
          />
          <UnstakeMessages
            isFeeStep={isFeeStep}
            hasActiveStake={hasActiveStake}
            hasPosition={!!position}
            amountExceedsMax={amountExceedsMax}
            maxUnstake={maxUnstake}
            maxUsdText={toUsd(price, maxUnstake)}
            unitAbbr={unitAbbr}
          />
        </Flex>

        {/* Info notes */}
        <UnstakeInfoNotes
          isFeeStep={isFeeStep}
          showDustWarning={showDustWarning}
          unitAbbr={unitAbbr}
        />
      </Flex>

      {/* Fee section */}
      {isFeeStep && (
        <UnstakeFeeBlock
          isFeeLoading={isFeeLoading}
          networkFee={networkFee}
          unitAbbr={unitAbbr}
          insufficientForFee={insufficientForFee}
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
          disabled={isProceedDisabled(
            isProceeding,
            isFeeStep,
            isFeeLoading,
            insufficientForFee,
            canProceed,
          )}
        >
          {isFeeStep ? 'Confirm Unstake' : 'Proceed'}
        </Button>
      </Flex>
    </div>
  );
};
