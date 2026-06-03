import { Container, Flex, Throbber, Typography } from '@cypherock/cysync-ui';
import React from 'react';

import { useHysp } from '~/context/hysp';

export const HyspVaultInfo: React.FC = () => {
  const { selectedAccount, vaultInfo, position, vaultInfoLoading } = useHysp();

  if (vaultInfoLoading) {
    return (
      <Container display="flex" justify="center" align="center" p={5}>
        <Throbber size={24} strokeWidth={2} />
      </Container>
    );
  }

  return (
    <Container display="flex" direction="column" gap={16} p={5} width="full">
      <Typography variant="h5">HYSP Vault</Typography>

      {vaultInfo && (
        <Flex direction="column" gap={8}>
          <Typography variant="p">APY: {vaultInfo.apy}%</Typography>
          <Typography variant="p">
            mevUSD Price: {parseFloat(vaultInfo.price).toFixed(4)}
          </Typography>
          <Typography variant="p">
            Instant Liquidity:{' '}
            {parseFloat(vaultInfo.instantLiquidity).toFixed(2)} USDC
          </Typography>
          <Typography variant="p">
            Deposit Fee: {vaultInfo.depositFee}%
          </Typography>
          <Typography variant="p">
            Redeem Fee: {vaultInfo.redeemFee}%
          </Typography>
        </Flex>
      )}

      {position && (
        <Flex direction="column" gap={8}>
          <Typography variant="h6">Your Position</Typography>
          <Typography variant="p">
            USDC: {parseFloat(position.usdcBalance).toFixed(4)}
          </Typography>
          {position.usdtBalance !== null && (
            <Typography variant="p">
              USDT: {parseFloat(position.usdtBalance).toFixed(4)}
            </Typography>
          )}
          <Typography variant="p">
            mevUSD: {parseFloat(position.mevUsdBalance).toFixed(4)}
          </Typography>
          <Typography variant="p">
            Value: {parseFloat(position.mevUsdValueUsdc).toFixed(4)} USDC
          </Typography>
        </Flex>
      )}

      {!selectedAccount && (
        <Typography variant="p" color="muted">
          Select a wallet and account to view your position.
        </Typography>
      )}
    </Container>
  );
};
