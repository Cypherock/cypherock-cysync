import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import {
  Button,
  Container,
  Dropdown,
  Flex,
  Input,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useHysp } from '~/context/hysp';

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
  } = useHysp();

  const isBase = selectedAccount?.assetId === 'base';
  const coinId =
    selectedAccount?.parentAssetId ?? selectedAccount?.assetId ?? '';

  const tokenOptions = [
    { id: 'usdc', text: 'USDC', checkType: 'radio' as const },
    ...(!isBase
      ? [{ id: 'usdt', text: 'USDT', checkType: 'radio' as const }]
      : []),
  ];

  let feeLabel = '';
  if (step === 'approveFee')
    feeLabel = `Approve gas: ${formatFee(
      approveTxn?.computedData.fee,
      coinId,
    )}`;
  else if (step === 'depositFee')
    feeLabel = `Deposit gas: ${formatFee(
      depositTxn?.computedData.fee,
      coinId,
    )}`;

  const canProceed = !!selectedAccount && !!amount && parseFloat(amount) > 0;

  let buttonLabel = 'Continue';
  if (step === 'approveFee') buttonLabel = 'Approve & Continue';
  else if (step === 'depositFee') buttonLabel = 'Confirm Deposit';

  return (
    <Container display="flex" direction="column" gap={24} p={5} width="full">
      <Typography variant="h5">Deposit USDC / USDT</Typography>

      <Flex direction="column" gap={16} width="full">
        <Dropdown
          items={walletDropdownList}
          selectedItem={selectedWallet?.__id}
          onChange={handleWalletChange}
          placeholderText="Select Wallet"
          searchText=""
        />

        <Dropdown
          items={accountDropdownList}
          selectedItem={selectedAccount?.__id}
          onChange={handleAccountChange}
          placeholderText="Select Account (ETH / Base)"
          searchText=""
          disabled={!selectedWallet}
        />

        <Dropdown
          items={tokenOptions}
          selectedItem={selectedToken}
          onChange={(id: string | undefined) =>
            setSelectedToken((id ?? 'usdc') as 'usdc' | 'usdt')
          }
          placeholderText="Select Token"
          searchText=""
          disabled={!selectedAccount}
        />

        <Input
          name="hysp-amount"
          type="number"
          value={amount}
          onChange={(val: string) => setAmount(val)}
          placeholder="Amount"
          disabled={!selectedAccount}
        />

        {feeLabel && (
          <Typography variant="p" color="muted">
            {feeLabel}
          </Typography>
        )}
      </Flex>

      <Button onClick={onProceed} disabled={!canProceed} variant="primary">
        {buttonLabel}
      </Button>
    </Container>
  );
};
