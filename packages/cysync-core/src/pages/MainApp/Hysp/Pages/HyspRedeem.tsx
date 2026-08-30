import {
  Button,
  Container,
  Dropdown,
  Flex,
  Input,
  MessageBox,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useMemo } from 'react';

import { useHysp } from '~/context/hysp';

export const HyspRedeem: React.FC = () => {
  const {
    selectedAccount,
    redeemAmount,
    setRedeemAmount,
    redeemTokenOut,
    setRedeemTokenOut,
    userRedeemChoice,
    setUserRedeemChoice,
    instantAvailable,
    vaultInfo,
    position,
    onProceed,
  } = useHysp();

  const isBase = selectedAccount?.assetId === 'base';

  // mevUSD equivalent in USDC for display
  const usdcEquivalent = useMemo(() => {
    const num = parseFloat(redeemAmount);
    const price = parseFloat(vaultInfo?.price ?? '0');
    if (!num || !price) return '';
    return (num * price).toFixed(4);
  }, [redeemAmount, vaultInfo?.price]);

  const tokenOutOptions = [
    { id: 'usdc', text: 'USDC', checkType: 'radio' as const },
    ...(!isBase
      ? [{ id: 'usdt', text: 'USDT', checkType: 'radio' as const }]
      : []),
  ];

  const maxMevUsd = position?.mevUsdBalance ?? '0';
  const canProceed =
    !!selectedAccount &&
    !!redeemAmount &&
    parseFloat(redeemAmount) > 0 &&
    parseFloat(redeemAmount) <= parseFloat(maxMevUsd);

  // Effective path: user's choice when instant is available, forced queue otherwise
  const effectivePath = instantAvailable ? userRedeemChoice : 'queue';
  const redeemFeePercent = vaultInfo?.redeemFee ?? 0;
  const hasAmount = !!redeemAmount && parseFloat(redeemAmount) > 0;

  return (
    <Container display="flex" direction="column" gap={24} p={5} width="full">
      <Typography variant="h5">Redeem mevUSD</Typography>

      <Flex direction="column" gap={16} width="full">
        <Input
          name="hysp-redeem-amount"
          type="number"
          value={redeemAmount}
          onChange={(val: string) => setRedeemAmount(val)}
          placeholder={`mevUSD amount (max: ${parseFloat(maxMevUsd).toFixed(
            4,
          )})`}
          disabled={!selectedAccount}
        />

        {usdcEquivalent && (
          <Typography variant="p" color="muted">
            ≈ {usdcEquivalent} USDC
          </Typography>
        )}

        {!isBase && (
          <Dropdown
            items={tokenOutOptions}
            selectedItem={redeemTokenOut}
            onChange={(id: string | undefined) =>
              setRedeemTokenOut((id ?? 'usdc') as 'usdc' | 'usdt')
            }
            placeholderText="Receive as"
            searchText=""
            disabled={!selectedAccount}
          />
        )}

        {/* Redemption type toggle — always shown when instant is available */}
        {hasAmount && instantAvailable && (
          <Flex direction="column" gap={8}>
            <Typography variant="p">Redemption type</Typography>
            <Flex direction="row" gap={8}>
              <Button
                variant={
                  userRedeemChoice === 'instant' ? 'primary' : 'secondary'
                }
                onClick={() => setUserRedeemChoice('instant')}
              >
                Instant
                {redeemFeePercent > 0 ? ` (${redeemFeePercent}% fee)` : ''}
              </Button>
              <Button
                variant={userRedeemChoice === 'queue' ? 'primary' : 'secondary'}
                onClick={() => setUserRedeemChoice('queue')}
              >
                Queue (0% fee, ~3 days)
              </Button>
            </Flex>
          </Flex>
        )}

        {/* Routing info */}
        {hasAmount && (
          <>
            {effectivePath === 'instant' && (
              <MessageBox
                type="infoGreen"
                text={`Instant redemption — funds arrive immediately${
                  redeemFeePercent > 0 ? ` (${redeemFeePercent}% fee)` : ''
                }`}
              />
            )}
            {effectivePath === 'queue' && instantAvailable && (
              <MessageBox
                type="info"
                text="Queue redemption — 0% fee, funds processed within 3 business days"
              />
            )}
            {effectivePath === 'queue' && !instantAvailable && (
              <MessageBox
                type="warning"
                text="Instant liquidity unavailable for this amount — queue redemption required. 0% fee, funds processed within 3 business days."
              />
            )}
          </>
        )}
      </Flex>

      <Button onClick={onProceed} disabled={!canProceed} variant="primary">
        Continue
      </Button>
    </Container>
  );
};
