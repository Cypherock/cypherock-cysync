import { Flex, LangDisplay, Throbber, Typography } from '@cypherock/cysync-ui';
import React from 'react';

export interface ValueDisplayProps {
  fee: string;
  value: string;
  isLoading: boolean;
}

export const ValueDisplay: React.FC<ValueDisplayProps> = ({
  fee,
  isLoading,
  value,
}) => (
  <Flex align="center" direction="row" gap={8}>
    {isLoading ? (
      <Throbber size={15} strokeWidth={2} />
    ) : (
      <>
        <Typography variant="span" $fontSize={14}>
          <LangDisplay text={fee} />
        </Typography>
        <Typography variant="span" color="muted" $fontSize={12}>
          <LangDisplay text={value} />
        </Typography>
      </>
    )}
  </Flex>
);
