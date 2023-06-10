import React from 'react';
import { Flex, Typography } from '../..';
import { Input, InputProps } from '..';

export const LabeledInput: React.FC<{ label: string } & InputProps> = ({
  label,
  ...inputProps
}) => (
  <Flex direction="column" width="full" align="flex-start" gap={8}>
    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
    <label>
      <Typography
        variant="fineprint"
        color="muted"
        ml={1}
        $letterSpacing={0.12}
      >
        {label}
      </Typography>
    </label>
    <Input width="full" {...inputProps} />
  </Flex>
);
