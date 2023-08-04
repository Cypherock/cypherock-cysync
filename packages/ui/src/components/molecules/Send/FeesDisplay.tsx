// FeesDisplay.tsx
import React from 'react';
import { Flex, LangDisplay, Typography } from '../../atoms';

interface FeesDisplayProps {
  fees: {
    network: string;
    fee: string;
    usd: string;
  };
  image?: React.ReactNode;
}

export const FeesDisplay: React.FC<FeesDisplayProps> = ({ fees, image }) => (
  <Flex justify="space-between" align="center" width="full">
    <Flex align="center" gap={8}>
      {image}
      <Typography variant="span" width="100%" color="muted" $fontSize={13}>
        <LangDisplay text={fees.network} />
      </Typography>
    </Flex>
    <Flex align="center" direction="row" gap={8}>
      <Typography variant="span" width="100%" $fontSize={14}>
        <LangDisplay text={fees.fee} />
      </Typography>
      <Typography variant="span" width="100%" color="muted" $fontSize={12}>
        <LangDisplay text={fees.usd} />
      </Typography>
    </Flex>
  </Flex>
);

FeesDisplay.defaultProps = {
  image: undefined,
};
