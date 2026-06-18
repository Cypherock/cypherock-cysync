import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  BlockchainIcon,
  Button,
  CustomInputSend,
  Dropdown,
  FeesSlider,
  Flex,
  Input,
  Throbber,
  Toggle,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { STAKEABLE_ASSETS } from '~/constants/hysp';
import { useHysp } from '~/context/hysp';
import { selectUnHiddenAccounts, useAppSelector } from '~/store';

const CARD: React.CSSProperties = {
  width: 500,
  borderRadius: 16,
  border: '1px solid #2C2520',
  background: 'linear-gradient(180deg, #211C18 0%, #211A16 50%, #252219 100%)',
  boxShadow: '4px 4px 32px 4px #0F0D0B',
  padding: 32,
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  maxHeight: '80vh',
  overflowY: 'auto',
};

const FIELD: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
};

const APY_CARD: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid #3C3C3C',
  background: '#27221D',
  display: 'flex',
  flexDirection: 'row',
};

const APY_CELL: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  padding: '12px 16px',
};

const ROW: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
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

export const HyspDeposit: React.FC = () => {
  const {
    selectedWallet,
    selectedAccount,
    walletDropdownList,
    accountDropdownList,
    handleWalletChange,
    handleAccountChange,
    selectedToken,
    setSelectedToken,
    amount,
    setAmount,
    onProceed,
    depositTxn,
    approveTxn,
    step,
    isFeeLoading,
    customGasPrice,
    setCustomGasPrice,
    onClose,
    vaultInfo,
    vaultInfoLoading,
  } = useHysp();

  const [stakeMax, setStakeMax] = useState(false);

  const { accounts } = useAppSelector(selectUnHiddenAccounts);

  const isBase = selectedAccount?.assetId?.startsWith('base');
  const coinId =
    selectedAccount?.parentAssetId ?? selectedAccount?.assetId ?? '';
  const tokenName = selectedToken.toUpperCase();

  const isFeeStep = step === 'approveFee' || step === 'depositFee';

  // Find the USDC/USDT sub-account for balance
  const tokenAssetId = STAKEABLE_ASSETS.find(
    a =>
      a.parentAssetId === selectedAccount?.assetId &&
      a.assetId.includes(selectedToken === 'usdc' ? 'usd-coin' : 'tether'),
  )?.assetId;

  const tokenAccount = selectedAccount
    ? accounts.find(
        a =>
          a.parentAccountId === selectedAccount.__id &&
          a.assetId === tokenAssetId,
      )
    : undefined;

  // Balance helpers
  const parseTokenBalance = (): { display: string; raw: string } => {
    if (!tokenAccount) return { display: '', raw: '' };
    try {
      const { amount: bal, unit } = getParsedAmount({
        coinId: tokenAccount.parentAssetId,
        assetId: tokenAccount.assetId,
        unitAbbr: getDefaultUnit(
          tokenAccount.parentAssetId,
          tokenAccount.assetId,
        ).abbr,
        amount: tokenAccount.balance,
      });
      return { display: `Available: ${bal} ${unit.abbr}`, raw: bal };
    } catch {
      return { display: '', raw: '' };
    }
  };

  const { display: balanceDisplay, raw: balanceRaw } = parseTokenBalance();

  const amountExceedsBalance =
    !!amount &&
    !!balanceRaw &&
    new BigNumber(amount).isGreaterThan(new BigNumber(balanceRaw));

  const handleToggleMax = (checked: boolean) => {
    setStakeMax(checked);
    if (checked) setAmount(balanceRaw);
    else setAmount('');
  };

  const canProceed =
    !!selectedAccount &&
    !!amount &&
    parseFloat(amount) > 0 &&
    !amountExceedsBalance;

  const tokenOptions = [
    { id: 'usdc', text: 'USDC', checkType: 'radio' as const },
    ...(!isBase
      ? [{ id: 'usdt', text: 'USDT', checkType: 'radio' as const }]
      : []),
  ];

  // Fee step helpers
  const activeTxn = step === 'approveFee' ? approveTxn : depositTxn;
  const averageGwei = activeTxn
    ? Number((activeTxn as any).staticData?.averageGasPrice) / 1e9
    : 1;
  const sliderValue = customGasPrice ?? averageGwei;

  // Scale fee proportionally to slider value so the display updates live.
  // fee = gasPrice × gasLimit, gasLimit is fixed, so fee scales linearly.
  const getDisplayFee = (): string => {
    const baseFeeWei = activeTxn?.computedData?.fee;
    if (!baseFeeWei || averageGwei === 0) return baseFeeWei ?? '';
    const ratio = sliderValue / averageGwei;
    return new BigNumber(baseFeeWei).multipliedBy(ratio).toFixed(0);
  };

  const feeLabel = formatFee(getDisplayFee(), coinId);

  const feeStepTitle =
    step === 'approveFee'
      ? `Approving ${tokenName} spend`
      : `Depositing ${amount} ${tokenName} into Midas Vault`;

  return (
    <div style={CARD}>
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <BlockchainIcon />
        <span
          style={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: 22,
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          {isFeeStep ? feeStepTitle : 'Start Staking'}
        </span>
        {!isFeeStep && (
          <span
            style={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: 14,
              color: '#8B8682',
              textAlign: 'center',
            }}
          >
            Select wallet and asset to continue
          </span>
        )}
      </div>

      {/* Fields — dimmed + locked on fee steps */}
      <div style={{ opacity: isFeeStep ? 0.5 : 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Wallet */}
        <div style={FIELD}>
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
        </div>

        {/* Account */}
        <div style={FIELD}>
          <Typography variant="span" color="muted" $fontSize={13}>
            Select Ethereum Account
          </Typography>
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            onChange={handleAccountChange}
            placeholderText="Choose Account"
            searchText=""
            disabled={!selectedWallet || isFeeStep}
          />
        </div>

        {/* Asset */}
        <div style={FIELD}>
          <Typography variant="span" color="muted" $fontSize={13}>
            Select Asset
          </Typography>
          <Dropdown
            items={tokenOptions}
            selectedItem={selectedToken}
            onChange={(id: string | undefined) =>
              setSelectedToken((id ?? 'usdc') as 'usdc' | 'usdt')
            }
            placeholderText="Select Token"
            searchText=""
            disabled={!selectedAccount || isFeeStep}
          />
        </div>

        {/* Amount */}
        <div style={FIELD}>
          <div style={ROW}>
            <Typography variant="span" color="muted" $fontSize={13}>
              Enter Amount
            </Typography>
            {!isFeeStep && (
              <Flex align="center" direction="row" gap={8}>
                <Typography variant="span" color="muted" $fontSize={13}>
                  Stake Max
                </Typography>
                {selectedAccount ? (
                  <Toggle checked={stakeMax} onToggle={handleToggleMax} />
                ) : (
                  <Toggle checked={false} />
                )}
              </Flex>
            )}
          </div>
          <CustomInputSend>
            <Input
              type="text"
              name="hysp-amount"
              placeholder="0"
              onChange={(val: string) => {
                setAmount(val.replace(/[^0-9.]/g, ''));
                if (stakeMax) setStakeMax(false);
              }}
              value={amount}
              disabled={!selectedAccount || stakeMax || isFeeStep}
              $textColor="white"
              $noBorder
            />
            <Typography $fontSize={16} color="muted" $allowOverflow>
              {tokenName}
            </Typography>
          </CustomInputSend>
          {!isFeeStep && balanceDisplay ? (
            <Typography variant="span" color="muted" $fontSize={12}>
              {balanceDisplay}
            </Typography>
          ) : null}
          {!isFeeStep && amountExceedsBalance ? (
            <Typography variant="span" color="error" $fontSize={12}>
              Amount exceeds available balance
            </Typography>
          ) : null}
        </div>
      </div>

      {/* Fee section only on fee steps */}
      {isFeeStep && (
        isFeeLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '8px 0' }}>
            <Throbber size={32} strokeWidth={2} />
            <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#8B8682', textAlign: 'center' }}>
              Fetching network fees, this may take a moment...
            </span>
          </div>
        ) : (
          activeTxn && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
              <div style={ROW}>
                <Typography variant="span" color="muted" $fontSize={13}>Gas Price</Typography>
                <Typography variant="span" $fontSize={13}>{sliderValue.toFixed(4)} Gwei</Typography>
              </div>
              <FeesSlider
                value={sliderValue}
                average={averageGwei}
                onChange={setCustomGasPrice}
                captions={[
                  { id: 0, name: 'Slow' },
                  { id: averageGwei, name: 'Average' },
                  { id: averageGwei * 2, name: 'Fast' },
                ]}
              />
              {feeLabel ? (
                <div style={ROW}>
                  <Typography variant="span" color="muted" $fontSize={13}>Network Fees</Typography>
                  <Typography variant="span" $fontSize={13}>{feeLabel}</Typography>
                </div>
              ) : null}
            </div>
          )
        )
      )}

      {/* APY Card — always rendered; shows spinner while loading */}
      <div style={APY_CARD}>
        {vaultInfoLoading || !vaultInfo ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <Throbber size={20} strokeWidth={2} />
          </div>
        ) : (
          <>
            <div style={APY_CELL}>
              <Typography variant="span" color="muted" $fontSize={12}>Est. APY</Typography>
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: 18,
                  background: 'linear-gradient(90deg, #E9BD5E 0%, #F5D98B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {vaultInfo.apy.toFixed(2)}%
              </span>
            </div>
            <div style={{ width: 1, background: '#3C3C3C', margin: '12px 0' }} />
            <div style={APY_CELL}>
              <Typography variant="span" color="muted" $fontSize={12}>Withdrawals</Typography>
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#FFFFFF' }}>
                Flexible
              </span>
              <Typography variant="span" color="muted" $fontSize={11}>No lock-up</Typography>
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose}>Back</Button>
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={isFeeStep ? isFeeLoading : !canProceed}
        >
          {step === 'approveFee'
            ? 'Approve & Continue'
            : step === 'depositFee'
            ? 'Confirm Deposit'
            : 'Connect & Proceed'}
        </Button>
      </div>
    </div>
  );
};
