import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import {
  BlockchainIcon,
  Button,
  CustomInputSend,
  DoubleArrow,
  Dropdown,
  Flex,
  Input,
  Typography,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React, { useEffect, useRef, useState } from 'react';

import { useCurrency } from '~/context';
import { useSolEverstake } from '~/context/everstake/sol';
import { SOL_MIN_STAKE_AMOUNT } from '~/context/everstake/sol/types';
import { lamportsToSol } from '~/context/everstake/sol/utils';
import { getStakeAccountDeposit } from '~/services/everstakeSolService';
import { selectCurrentCurrencyPriceInfos, useAppSelector } from '~/store';

import {
  CARD_STYLE,
  INFO_NOTE_STYLE,
  MAX_TOKEN_DECIMALS,
  MAX_USD_DECIMALS,
  STAKE_PERCENTAGE_OPTIONS,
  sanitizeAmountInput,
} from './shared';
import { SolFeeSection } from './SolFeeSection';

type LastEdited = 'token' | 'usd' | null;

type SolEverstake = ReturnType<typeof useSolEverstake>;

const NOTE_TEXT_STYLE: React.CSSProperties = {
  color: '#C4922A',
  lineHeight: 1.6,
  display: 'block',
  fontSize: 12,
};

// Refundable deposit (rent reserve) the new stake account needs, in lamports
const useStakeAccountDeposit = (assetId: string | undefined) => {
  const [depositLamports, setDepositLamports] = useState<string | undefined>();
  useEffect(() => {
    if (!assetId) return undefined;
    let cancelled = false;
    getStakeAccountDeposit(assetId)
      .then(d => {
        if (!cancelled) setDepositLamports(d);
      })
      .catch(() => {
        if (!cancelled) setDepositLamports(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [assetId]);
  return depositLamports;
};

const computeBalance = (
  selectedAccount: SolEverstake['selectedAccount'],
): { display: string; raw: string } => {
  if (!selectedAccount) return { display: '', raw: '' };
  try {
    const { amount: bal, unit } = getParsedAmount({
      coinId: selectedAccount.parentAssetId,
      assetId: selectedAccount.assetId,
      unitAbbr: getDefaultUnit(
        selectedAccount.parentAssetId,
        selectedAccount.assetId,
      ).abbr,
      amount: selectedAccount.balance,
    });
    return { display: `Available: ${bal} ${unit.abbr}`, raw: bal };
  } catch {
    return { display: '', raw: '' };
  }
};

const computeUsdInput = (amount: string, price: string | undefined) =>
  amount && price ? new BigNumber(amount).multipliedBy(price).toFixed(2) : '';

const computeAmountExceedsBalance = (amount: string, balanceRaw: string) =>
  !!amount &&
  !!balanceRaw &&
  new BigNumber(amount).isGreaterThan(new BigNumber(balanceRaw));

const computeAmountBelowMin = (amount: string) =>
  !!amount &&
  parseFloat(amount) > 0 &&
  new BigNumber(amount).isLessThan(new BigNumber(SOL_MIN_STAKE_AMOUNT));

const computeCanProceed = (
  hasAccount: boolean,
  amount: string,
  amountExceedsBalance: boolean,
  amountBelowMin: boolean,
) =>
  hasAccount &&
  !!amount &&
  parseFloat(amount) > 0 &&
  !amountExceedsBalance &&
  !amountBelowMin;

const computeInsufficientForFee = (
  isFeeStep: boolean,
  isFeeLoading: boolean,
  networkFee: string | undefined,
  amount: string,
  deposit: BigNumber,
  balanceRaw: string,
) =>
  isFeeStep &&
  !isFeeLoading &&
  !!networkFee &&
  new BigNumber(amount || '0')
    .plus(deposit)
    .plus(lamportsToSol(networkFee))
    .isGreaterThan(new BigNumber(balanceRaw || '0'));

const computeCannotVerifyBalance = (
  isFeeStep: boolean,
  isFeeLoading: boolean,
  networkFee: string | undefined,
  depositLamports: string | undefined,
) => isFeeStep && !isFeeLoading && (!networkFee || !depositLamports);

const isProceedDisabled = (
  isProceeding: boolean,
  isFeeStep: boolean,
  isFeeLoading: boolean,
  insufficientForFee: boolean,
  cannotVerifyBalance: boolean,
  canProceed: boolean,
) =>
  isProceeding ||
  (isFeeStep
    ? isFeeLoading || insufficientForFee || cannotVerifyBalance
    : !canProceed);

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

const WalletAccountSelectors: React.FC<{
  isFeeStep: boolean;
  selectedWallet: SolEverstake['selectedWallet'];
  selectedAccount: SolEverstake['selectedAccount'];
  walletDropdownList: SolEverstake['walletDropdownList'];
  accountDropdownList: SolEverstake['accountDropdownList'];
  handleWalletChange: SolEverstake['handleWalletChange'];
  handleAccountChange: SolEverstake['handleAccountChange'];
}> = ({
  isFeeStep,
  selectedWallet,
  selectedAccount,
  walletDropdownList,
  accountDropdownList,
  handleWalletChange,
  handleAccountChange,
}) => (
  <>
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
        Select Solana Account
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
  </>
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

const StakeAmountInputs: React.FC<{
  unitAbbr: string;
  price: string | undefined;
  amount: string;
  usdInput: string;
  inputsDisabled: boolean;
  lastEditedRef: React.MutableRefObject<LastEdited>;
  setAmount: (val: string) => void;
  setUsdInput: (val: string) => void;
  setSelectedPercentage: (val: number | null) => void;
}> = ({
  unitAbbr,
  price,
  amount,
  usdInput,
  inputsDisabled,
  lastEditedRef,
  setAmount,
  setUsdInput,
  setSelectedPercentage,
}) => (
  <Flex gap={8} align="center" width="full">
    <CustomInputSend>
      <Input
        type="text"
        name="everstake-sol-amount"
        placeholder="0"
        onChange={(val: string) => {
          lastEditedRef.current = 'token';
          setSelectedPercentage(null);
          setAmount(sanitizeAmountInput(val, MAX_TOKEN_DECIMALS));
        }}
        value={amount}
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
            name="everstake-sol-amount-usd"
            placeholder="0"
            onChange={(val: string) => {
              if (!price) return;
              lastEditedRef.current = 'usd';
              setSelectedPercentage(null);
              const filtered = sanitizeAmountInput(val, MAX_USD_DECIMALS);
              setUsdInput(filtered);
              setAmount(
                filtered
                  ? new BigNumber(filtered).dividedBy(price).toFixed(6)
                  : '',
              );
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

const StakeMessages: React.FC<{
  isFeeStep: boolean;
  balanceDisplay: string;
  amountBelowMin: boolean;
  amountExceedsBalance: boolean;
  depositLamports: string | undefined;
  deposit: BigNumber;
  unitAbbr: string;
}> = ({
  isFeeStep,
  balanceDisplay,
  amountBelowMin,
  amountExceedsBalance,
  depositLamports,
  deposit,
  unitAbbr,
}) => (
  <>
    {!isFeeStep && balanceDisplay ? (
      <Typography variant="span" color="muted" $fontSize={12}>
        {balanceDisplay}
      </Typography>
    ) : null}
    {!isFeeStep && amountBelowMin ? (
      <Typography variant="span" color="error" $fontSize={12}>
        Minimum stake is {SOL_MIN_STAKE_AMOUNT} {unitAbbr}
      </Typography>
    ) : null}
    {!isFeeStep && amountExceedsBalance ? (
      <Typography variant="span" color="error" $fontSize={12}>
        Amount exceeds available balance
      </Typography>
    ) : null}
    {!isFeeStep ? (
      <Typography variant="span" color="muted" $fontSize={12}>
        Each stake creates its own stake account, so keep a little {unitAbbr}{' '}
        aside for the refundable deposit and network fees.
      </Typography>
    ) : null}
    {!isFeeStep && depositLamports ? (
      <div style={INFO_NOTE_STYLE}>
        <span style={NOTE_TEXT_STYLE}>
          {`A refundable deposit of about ${deposit.toFixed()} ${unitAbbr} is held in your new stake account on top of the amount you stake. It is returned to you when you claim.`}
        </span>
      </div>
    ) : null}
  </>
);

const DepositSummary: React.FC<{
  amount: string;
  deposit: BigNumber;
  unitAbbr: string;
}> = ({ amount, deposit, unitAbbr }) => (
  <>
    <Flex justify="space-between" align="center" width="full">
      <Typography variant="span" color="muted" $fontSize={13}>
        Refundable deposit (rent reserve)
      </Typography>
      <Typography variant="span" $fontSize={13}>
        {`${deposit.toFixed()} ${unitAbbr}`}
      </Typography>
    </Flex>
    {/* Same figure the device shows as "Verify stake amount" */}
    <Flex justify="space-between" align="center" width="full">
      <Typography variant="span" color="muted" $fontSize={13}>
        Total to your stake account
      </Typography>
      <Typography variant="span" $fontSize={13}>
        {`${new BigNumber(amount || '0').plus(deposit).toFixed()} ${unitAbbr}`}
      </Typography>
    </Flex>
  </>
);

const StakeFeeBlock: React.FC<{
  amount: string;
  deposit: BigNumber;
  depositLamports: string | undefined;
  isFeeLoading: boolean;
  networkFee: string | undefined;
  unitAbbr: string;
  cannotVerifyBalance: boolean;
  insufficientForFee: boolean;
}> = ({
  amount,
  deposit,
  depositLamports,
  isFeeLoading,
  networkFee,
  unitAbbr,
  cannotVerifyBalance,
  insufficientForFee,
}) => (
  <Flex direction="column" gap={16} width="full">
    {depositLamports ? (
      <DepositSummary amount={amount} deposit={deposit} unitAbbr={unitAbbr} />
    ) : null}
    <SolFeeSection
      isLoading={isFeeLoading}
      feeLamports={networkFee}
      unitAbbr={unitAbbr}
    />
    {cannotVerifyBalance ? (
      <Typography variant="span" color="error" $fontSize={13}>
        Could not load the deposit or network fee, so your balance cannot be
        checked. Go back and try again.
      </Typography>
    ) : null}
    {insufficientForFee ? (
      <Typography variant="span" color="error" $fontSize={13}>
        Amount plus deposit and network fee exceed your available balance. Lower
        the amount and try again.
      </Typography>
    ) : null}
  </Flex>
);

export const SolStake: React.FC = () => {
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
    step,
    isFeeLoading,
    networkFee,
    onClose,
    unitAbbr,
    isProceeding,
  } = useSolEverstake();

  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );

  const [usdInput, setUsdInput] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(
    null,
  );
  const lastEditedRef = useRef<LastEdited>(null);

  const depositLamports = useStakeAccountDeposit(selectedAccount?.assetId);
  const deposit = depositLamports
    ? lamportsToSol(depositLamports)
    : new BigNumber(0);

  const isFeeStep = step === 'stakeReview';

  const { display: balanceDisplay, raw: balanceRaw } =
    computeBalance(selectedAccount);

  const price = priceInfos.find(
    p => selectedAccount && p.assetId === selectedAccount.assetId,
  )?.latestPrice;

  useEffect(() => {
    if (lastEditedRef.current === 'usd') return;
    setUsdInput(computeUsdInput(amount, price));
  }, [amount, price]);

  useEffect(() => {
    setSelectedPercentage(null);
  }, [selectedAccount?.__id]);

  const amountExceedsBalance = computeAmountExceedsBalance(amount, balanceRaw);
  const amountBelowMin = computeAmountBelowMin(amount);

  const handleFillPercentage = (pct: number) => {
    if (!balanceRaw) return;
    lastEditedRef.current = 'token';
    setSelectedPercentage(pct);
    const filled = new BigNumber(balanceRaw)
      .multipliedBy(pct / 100)
      .toFixed(MAX_TOKEN_DECIMALS, BigNumber.ROUND_FLOOR);
    setAmount(sanitizeAmountInput(filled, MAX_TOKEN_DECIMALS));
  };

  const canProceed = computeCanProceed(
    !!selectedAccount,
    amount,
    amountExceedsBalance,
    amountBelowMin,
  );

  const insufficientForFee = computeInsufficientForFee(
    isFeeStep,
    isFeeLoading,
    networkFee,
    amount,
    deposit,
    balanceRaw,
  );

  const cannotVerifyBalance = computeCannotVerifyBalance(
    isFeeStep,
    isFeeLoading,
    networkFee,
    depositLamports,
  );

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
      <StakeTitle isFeeStep={isFeeStep} amount={amount} unitAbbr={unitAbbr} />

      {/* Fields — dimmed on fee step */}
      <Flex direction="column" gap={24} opacity={isFeeStep ? 0.5 : 1}>
        <WalletAccountSelectors
          isFeeStep={isFeeStep}
          selectedWallet={selectedWallet}
          selectedAccount={selectedAccount}
          walletDropdownList={walletDropdownList}
          accountDropdownList={accountDropdownList}
          handleWalletChange={handleWalletChange}
          handleAccountChange={handleAccountChange}
        />

        {/* Amount */}
        <Flex direction="column" gap={8} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Typography variant="span" color="muted" $fontSize={13}>
              Enter Amount
            </Typography>
            {!isFeeStep && (
              <PercentageButtons
                selectedPercentage={selectedPercentage}
                isDisabled={!selectedAccount || !balanceRaw}
                onFill={handleFillPercentage}
              />
            )}
          </Flex>
          <StakeAmountInputs
            unitAbbr={unitAbbr}
            price={price}
            amount={amount}
            usdInput={usdInput}
            inputsDisabled={!selectedAccount || isFeeStep}
            lastEditedRef={lastEditedRef}
            setAmount={setAmount}
            setUsdInput={setUsdInput}
            setSelectedPercentage={setSelectedPercentage}
          />
          <StakeMessages
            isFeeStep={isFeeStep}
            balanceDisplay={balanceDisplay}
            amountBelowMin={amountBelowMin}
            amountExceedsBalance={amountExceedsBalance}
            depositLamports={depositLamports}
            deposit={deposit}
            unitAbbr={unitAbbr}
          />
        </Flex>
      </Flex>

      {/* Fee section */}
      {isFeeStep && (
        <StakeFeeBlock
          amount={amount}
          deposit={deposit}
          depositLamports={depositLamports}
          isFeeLoading={isFeeLoading}
          networkFee={networkFee}
          unitAbbr={unitAbbr}
          cannotVerifyBalance={cannotVerifyBalance}
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
            cannotVerifyBalance,
            canProceed,
          )}
        >
          {isFeeStep ? 'Confirm Stake' : 'Proceed'}
        </Button>
      </Flex>
    </div>
  );
};
