import { Flex, Typography, LangDisplay, Throbber } from '@cypherock/cysync-ui';
import React from 'react';

interface FeesDisplayProps {
  label: string;
  fee: string;
  value: string;
  image?: React.ReactNode;
  isLoading: boolean;
}

export const FeesDisplay: React.FC<FeesDisplayProps> = ({
  fee,
  label,
  value,
  image,
  isLoading,
}) => (
  <Flex justify="space-between" align="center" width="full">
    <Flex align="center" gap={8}>
      {image}
      <Typography variant="span" width="100%" color="muted" $fontSize={13}>
        <LangDisplay text={label} />
      </Typography>
    </Flex>
    <Flex align="center" direction="row" gap={8}>
      {isLoading ? (
        <Throbber size={15} strokeWidth={2} />
      ) : (
        <>
          <Typography variant="span" width="100%" $fontSize={14}>
            <LangDisplay text={fee} />
          </Typography>
          <Typography variant="span" width="100%" color="muted" $fontSize={12}>
            <LangDisplay text={value} />
          </Typography>
        </>
      )}
    </Flex>
  </Flex>
);

FeesDisplay.defaultProps = {
  image: undefined,
};
