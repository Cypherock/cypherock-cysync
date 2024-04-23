import { Flex, Typography, LangDisplay } from '@cypherock/cysync-ui';
import React from 'react';

import { ValueDisplay, ValueDisplayProps } from './ValueDisplay';

interface FeesDisplayProps {
  label: string;
  image?: React.ReactNode;
}

export const FeesDisplay: React.FC<FeesDisplayProps & ValueDisplayProps> = ({
  fee,
  label,
  value,
  image,
  isLoading,
}) => (
  <Flex justify="space-between" align="center" width="full">
    <Flex align="center" gap={8}>
      {image}
      <Typography variant="span" color="muted" $fontSize={13}>
        <LangDisplay text={label} />
      </Typography>
    </Flex>
    <ValueDisplay fee={fee} isLoading={isLoading} value={value} />
  </Flex>
);

FeesDisplay.defaultProps = {
  image: undefined,
};
