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
  Throbber,
  Toggle,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { useEverstake } from '~/context/everstake';
import { useCurrency } from '~/context';
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
  } = useEverstake();

  const { currentCurrency } = useCurrency();
  const priceInfos = useAppSelector(state =>
    selectCurrentCurrencyPriceInfos(state, currentCurrency),
  );

  const [stakeMax, setStakeMax] = useState(false);

  const coinId = selectedAccount?.assetId ?? '';
  const isFeeStep = step === 'stakeFee';

  const parseEthBalance = (): { display: string; raw: string } => {
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

  const { display: balanceDisplay, raw: balanceRaw } = parseEthBalance();

  const ethPrice = priceInfos.find(
    p => selectedAccount && p.assetId === selectedAccount.assetId,
  )?.latestPrice;

  const amountExceedsBalance =
    !!amount &&
    !!balanceRaw &&
    new BigNumber(amount).isGreaterThan(new BigNumber(balanceRaw));

  const amountBelowMin =
    !!amount &&
    parseFloat(amount) > 0 &&
    new BigNumber(amount).isLessThan(new BigNumber(minStakeAmount));

  const handleToggleMax = (checked: boolean) => {
    setStakeMax(checked);
    if (checked) setAmount(balanceRaw);
    else setAmount('');
  };

  const canProceed =
    !!selectedAccount &&
    !!amount &&
    parseFloat(amount) > 0 &&
    !amountExceedsBalance &&
    !amountBelowMin;

  const averageGwei = stakeTxn
    ? Number((stakeTxn as any).staticData?.averageGasPrice) / 1e9
    : 1;
  const sliderValue = customGasPrice ?? averageGwei;

  const getDisplayFee = (): string => {
    const baseFeeWei = stakeTxn?.computedData?.fee;
    if (!baseFeeWei || averageGwei === 0) return baseFeeWei ?? '';
    const ratio = sliderValue / averageGwei;
    return new BigNumber(baseFeeWei).multipliedBy(ratio).toFixed(0);
  };

  const feeLabel = formatFee(getDisplayFee(), coinId);

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
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
            {assetConfig
              ? `Select ${assetConfig.label} Account`
              : 'Select Account'}
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
            {!isFeeStep && (
              <Flex align="center" gap={8}>
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
          </Flex>
          <Flex gap={8} align="center" width="full">
            <CustomInputSend>
              <Input
                type="text"
                name="everstake-amount"
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
                    onChange={(val: string) => {
                      if (!ethPrice) return;
                      const filtered = val.replace(/[^0-9.]/g, '');
                      const eth = filtered
                        ? new BigNumber(filtered).dividedBy(ethPrice).toFixed(6)
                        : '';
                      setAmount(eth);
                      if (stakeMax) setStakeMax(false);
                    }}
                    value={
                      amount && ethPrice
                        ? new BigNumber(amount)
                            .multipliedBy(ethPrice)
                            .toFixed(2)
                        : ''
                    }
                    disabled={!selectedAccount || stakeMax || isFeeStep}
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
          {!isFeeStep && balanceDisplay ? (
            <Typography variant="span" color="muted" $fontSize={12}>
              {balanceDisplay}
            </Typography>
          ) : null}
          {!isFeeStep && amountBelowMin ? (
            <Typography variant="span" color="error" $fontSize={12}>
              Minimum stake is {minStakeAmount} {unitAbbr}
            </Typography>
          ) : null}
          {!isFeeStep && amountExceedsBalance ? (
            <Typography variant="span" color="error" $fontSize={12}>
              Amount exceeds available balance
            </Typography>
          ) : null}
          {!isFeeStep && assetConfig?.kind === 'pol' ? (
            <Typography variant="span" color="muted" $fontSize={12}>
              If this is your first time staking {unitAbbr}, you may be asked to
              sign an additional approval transaction before staking.
            </Typography>
          ) : null}
        </Flex>
      </Flex>

      {/* Fee section */}
      {isFeeStep &&
        (isFeeLoading ? (
          <Flex direction="column" align="center" gap={16} py="8px">
            <Throbber size={32} strokeWidth={2} />
            <Typography
              variant="span"
              color="muted"
              $fontSize={13}
              $textAlign="center"
            >
              Fetching network fees...
            </Typography>
          </Flex>
        ) : (
          stakeTxn && (
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
                onChange={setCustomGasPrice}
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
            </Flex>
          )
        ))}

      {/* Buttons */}
      <Flex gap={16} justify="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={isFeeStep ? isFeeLoading : !canProceed}
        >
          {isFeeStep ? 'Confirm Stake' : 'Proceed'}
        </Button>
      </Flex>
    </div>
  );
};
