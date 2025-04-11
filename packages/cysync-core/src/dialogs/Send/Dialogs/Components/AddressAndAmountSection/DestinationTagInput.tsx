import {
  Container,
  Flex,
  LangDisplay,
  Typography,
  CustomInputSend,
  Input,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

interface DestinationTagInputProps {
  label: string;
  placeholder: string;
  initialValue?: number;
  onChange: (value: number) => Promise<void>;
  error?: string;
  isDisabled?: boolean;
}

export const DestinationTagInput: React.FC<DestinationTagInputProps> = ({
  label,
  placeholder,
  initialValue,
  onChange,
  error,
  isDisabled,
}) => {
  const [value, setValue] = useState<string>(initialValue?.toString() ?? '');

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onChange, 300),
    [],
  );

  const handleValueChange = (newValue: string) => {
    let filteredValue = newValue.replace(/[^0-9]/g, '');
    let bigNum = new BigNumber(filteredValue);

    if (bigNum.isNaN()) {
      filteredValue = '';
      bigNum = new BigNumber(-1);
    }

    setValue(filteredValue);
    debouncedOnValueChange(bigNum.toNumber());
  };

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
      </Flex>
      <CustomInputSend>
        <Input
          type="text"
          name="destinationTag"
          placeholder={placeholder}
          onChange={handleValueChange}
          disabled={isDisabled}
          value={value}
          $textColor="white"
          $noBorder
        />
      </CustomInputSend>
      {error && (
        <Typography
          variant="span"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          {error}
        </Typography>
      )}
    </Container>
  );
};

DestinationTagInput.defaultProps = {
  initialValue: undefined,
  error: '',
  isDisabled: undefined,
};
