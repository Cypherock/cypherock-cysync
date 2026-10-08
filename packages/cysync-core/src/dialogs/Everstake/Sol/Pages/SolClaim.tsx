import { BlockchainIcon, Button, Flex, Typography } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import React from 'react';

import { useSolEverstake } from '~/context/everstake/sol';
import { formatSol, lamportsToSol } from '~/context/everstake/sol/utils';

import { SolFeeSection } from './SolFeeSection';
import { CARD_STYLE, CLAIMABLE_BOX_STYLE, INFO_NOTE_STYLE } from './shared';

// Claim has no amount input: it withdraws every deactivated stake account.
export const SolClaim: React.FC = () => {
  const {
    selectedAccount,
    isFeeLoading,
    networkFee,
    onProceed,
    onClose,
    claimLamports,
    unitAbbr,
    isProceeding,
    position,
  } = useSolEverstake();

  // Refundable deposits (rent reserves) are returned along with the stake
  const deposit = position
    ? new BigNumber(position.deactivated.lamports).minus(
        position.deactivated.stakeLamports,
      )
    : new BigNumber(0);

  const insufficientForFee =
    !isFeeLoading &&
    !!networkFee &&
    !!selectedAccount &&
    lamportsToSol(networkFee).isGreaterThan(
      lamportsToSol(selectedAccount.balance),
    );

  return (
    <div style={CARD_STYLE}>
      {/* Title */}
      <Flex direction="column" gap={4} align="center">
        <BlockchainIcon />
        <Typography variant="h5" $textAlign="center" $fontSize={22}>
          Claim
        </Typography>
        <Typography
          variant="span"
          color="muted"
          $fontSize={14}
          $textAlign="center"
        >
          {`Move your unstaked ${unitAbbr} back to your wallet`}
        </Typography>
      </Flex>

      {/* Claimable amount */}
      <div style={CLAIMABLE_BOX_STYLE}>
        <Typography variant="span" color="muted" $fontSize={12}>
          Ready to claim
        </Typography>
        <span style={{ color: '#4CAF7D', fontWeight: 600, fontSize: 22 }}>
          {`${formatSol(claimLamports)} ${unitAbbr}`}
        </span>
      </div>
      {deposit.isGreaterThan(0) ? (
        <div style={INFO_NOTE_STYLE}>
          <span
            style={{
              color: '#C4922A',
              lineHeight: 1.6,
              display: 'block',
              fontSize: 12,
            }}
          >
            {`Includes ${formatSol(
              deposit.toFixed(),
            )} ${unitAbbr} of refundable deposit from your stake accounts.`}
          </span>
        </div>
      ) : null}

      {/* Fee section */}
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

      {/* Buttons */}
      <Flex gap={16} justify="flex-end">
        <Button variant="secondary" onClick={onClose}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={onProceed}
          disabled={isProceeding || isFeeLoading || insufficientForFee}
        >
          Confirm Claim
        </Button>
      </Flex>
    </div>
  );
};
