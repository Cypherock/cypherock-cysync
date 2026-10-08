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

export const EverstakeStakeDone: React.FC = () => {
  const { onClose, amount, txHash, unitAbbr } = useEverstake();

  return (
    <>
      <ConfettiBlast />
      <DialogBox width={500} align="center">
        <DialogBoxBody>
          <Image src={successIcon} alt="Success" />
          <Flex direction="column" align="center" gap={4}>
            <Typography variant="h4" $textAlign="center">
              Staking Initiated!
            </Typography>
            <Typography variant="h6" $textAlign="center" color="muted">
              {`${amount} ${unitAbbr} has been sent to Everstake. Your staking position will be active once the transaction is confirmed on-chain.`}
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
