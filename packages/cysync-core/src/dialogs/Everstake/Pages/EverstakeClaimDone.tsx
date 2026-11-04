import {
  ConfettiBlast,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Button,
  Typography,
  Flex,
  CopyContainer,
  GoldExternalLink,
  Image,
  successIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useEverstake } from '~/context/everstake';
import { truncateMiddle } from '~/utils';

const MODE_DONE_COPY: Record<string, { heading: string; verb: string }> = {
  claim: { heading: 'Claim Successful!', verb: 'claimed' },
  claimUnstake: { heading: 'Claim Successful!', verb: 'claimed' },
  claimRewards: { heading: 'Rewards Claimed!', verb: 'claimed' },
  restake: { heading: 'Restake Successful!', verb: 'restaked' },
};

export const EverstakeClaimDone: React.FC = () => {
  const { onClose, claimAmountRaw, txHash, mode, unitAbbr } = useEverstake();
  const copy = MODE_DONE_COPY[mode] ?? MODE_DONE_COPY.claim;

  const claimable = (() => {
    if (!claimAmountRaw) return '';
    try {
      return `${parseFloat(
        parseFloat(claimAmountRaw).toFixed(6),
      ).toString()} ${unitAbbr}`;
    } catch {
      return '';
    }
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
              {claimable
                ? `${claimable} has been ${copy.verb}${
                    mode === 'restake'
                      ? ' back into your stake.'
                      : ' and is on its way to your wallet.'
                  }`
                : `Your ${unitAbbr} has been successfully ${copy.verb}.`}
            </Typography>
          </Flex>
          {txHash && (
            <Flex direction="column" gap={8} width="full">
              <Flex justify="space-between" align="center" width="full">
                <Typography variant="span" color="muted" $fontSize={13}>
                  Transaction Hash
                </Typography>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
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
