import {
  Container,
  Flex,
  LangDisplay,
  Typography,
  NumberInput,
  CustomInputSend,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

interface DestinationTagInputProps {
  label: string;
  placeholder: string;
  initialValue?: number;
  onChange: (value: number) => Promise<void>;
  error?: string;
}

export const DestinationTagInput: React.FC<DestinationTagInputProps> = ({
  label,
  placeholder,
  initialValue,
  onChange,
  error,
}) => {
  const [value, setValue] = useState(initialValue);

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onChange, 300),
    [],
  );

  const handleValueChange = (newValue: number) => {
    setValue(newValue);
    debouncedOnValueChange(newValue);
  };

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
      </Flex>
      <CustomInputSend>
        <NumberInput
          name="destinationTag"
          placeholder={placeholder}
          initialValue={value}
          onChange={handleValueChange}
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
};
