import {
  CopyContainer,
  Flex,
  GoldExternalLink,
  HourglassIcon,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useEverstake } from '~/context/everstake';
import { truncateMiddle } from '~/utils';

const CARD_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  alignItems: 'center',
  width: 500,
  borderRadius: 16,
  border: '1px solid #2C2520',
  background: 'linear-gradient(180deg, #211C18 0%, #211A16 50%, #252219 100%)',
  boxShadow: '4px 4px 32px 4px #0F0D0B',
  padding: 32,
};

export const EverstakeApproveConfirming: React.FC = () => {
  const { approveTxHash, approveTakingLonger, unitAbbr } = useEverstake();

  return (
    <div style={CARD_STYLE}>
      <HourglassIcon width={28} height={28} />
      <Flex direction="column" gap={8} align="center">
        <Typography variant="h5" $textAlign="center" $fontSize={20}>
          {approveTakingLonger
            ? 'Still waiting for confirmation'
            : 'Confirming approval on-chain'}
        </Typography>
        <Typography
          variant="span"
          color="muted"
          $fontSize={14}
          $textAlign="center"
          $lineHeight="1.6"
        >
          {approveTakingLonger
            ? `This is taking longer than expected. You can check the transaction below to see its status. Once it's confirmed, this step won't ask you to approve ${unitAbbr} again — staking will continue automatically.`
            : `Waiting for your approval transaction to confirm on-chain before continuing to stake ${unitAbbr}.`}
        </Typography>
      </Flex>

      {!approveTakingLonger && <Throbber size={28} strokeWidth={2} />}

      {approveTxHash && (
        <Flex direction="column" gap={8} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Typography variant="span" color="muted" $fontSize={13}>
              Approval Transaction
            </Typography>
            <a
              href={`https://etherscan.io/tx/${approveTxHash}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <GoldExternalLink height={12} width={12} />
            </a>
          </Flex>
          <CopyContainer
            link={truncateMiddle(approveTxHash)}
            copyValue={approveTxHash}
            variant="gold"
          />
        </Flex>
      )}
    </div>
  );
};
