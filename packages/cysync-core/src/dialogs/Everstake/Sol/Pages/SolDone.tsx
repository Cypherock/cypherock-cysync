import {
  Button,
  ConfettiBlast,
  CopyContainer,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  GoldExternalLink,
  Image,
  Typography,
  successIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useSolEverstake } from '~/context/everstake/sol';
import { formatSol } from '~/context/everstake/sol/utils';
import { truncateMiddle } from '~/utils';

import { getSolscanTxUrl } from './shared';

export const SolDone: React.FC = () => {
  const {
    onClose,
    mode,
    amount,
    unstakeAmount,
    claimLamports,
    txHash,
    unitAbbr,
  } = useSolEverstake();

  const copy = (() => {
    if (mode === 'unstake') {
      return {
        heading: 'Unstake Submitted!',
        body: `${unstakeAmount} ${unitAbbr} has been submitted for unstaking. It will be ready to claim once the current epoch ends (about 2-3 days).`,
      };
    }
    if (mode === 'claim') {
      return {
        heading: 'Claim Successful!',
        body: `${formatSol(
          claimLamports,
        )} ${unitAbbr} has been claimed and is on its way to your wallet.`,
      };
    }
    return {
      heading: 'Staking Initiated!',
      body: `${amount} ${unitAbbr} has been sent to Everstake. Your stake will start earning once the transaction is confirmed and the next epoch begins.`,
    };
  })();

  return (
    <>
      <ConfettiBlast />
      <DialogBox width={500} align="center">
        <DialogBoxBody>
          <Image src={successIcon} alt="Success" />
          <Flex direction="column" align="center" gap={4}>
            <Typography variant="h4" $textAlign="center">
              {copy.heading}
            </Typography>
            <Typography variant="h6" $textAlign="center" color="muted">
              {copy.body}
            </Typography>
          </Flex>
          {txHash && (
            <Flex direction="column" gap={8} width="full">
              <Flex justify="space-between" align="center" width="full">
                <Typography variant="span" color="muted" $fontSize={13}>
                  Transaction Hash
                </Typography>
                <a
                  href={getSolscanTxUrl(txHash)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <GoldExternalLink height={12} width={12} />
                </a>
              </Flex>
              <CopyContainer
                link={truncateMiddle(txHash)}
                copyValue={txHash}
                variant="gold"
              />
            </Flex>
          )}
        </DialogBoxBody>
        <DialogBoxFooter height={101}>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </>
  );
};
