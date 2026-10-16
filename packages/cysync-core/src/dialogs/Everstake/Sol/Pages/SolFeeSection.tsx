import { Flex, Throbber, Typography } from '@cypherock/cysync-ui';
import React from 'react';

import { formatSol } from '~/context/everstake/sol/utils';

export const SolFeeSection: React.FC<{
  isLoading: boolean;
  feeLamports: string | undefined;
  unitAbbr: string;
}> = ({ isLoading, feeLamports, unitAbbr }) => {
  if (isLoading) {
    return (
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
    );
  }

  if (!feeLamports || feeLamports === '0') return null;

  return (
    <Flex justify="space-between" align="center" width="full">
      <Typography variant="span" color="muted" $fontSize={13}>
        Network Fees
      </Typography>
      <Typography variant="span" $fontSize={13}>
        {`${formatSol(feeLamports, 9)} ${unitAbbr}`}
      </Typography>
    </Flex>
  );
};
