import {
  Container,
  Flex,
  Input,
  LangDisplay,
  Typography,
  CustomInputSend,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

interface NotesInputProps {
  label: string;
  placeholder?: string;
  initialValue?: string;
  onChange: (value: string) => Promise<void>;
}

export const NotesInput: React.FC<NotesInputProps> = ({
  label,
  placeholder,
  initialValue,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue ?? '');

  const onValueChange = async (val: string) => {
    await onChange(val);
  };

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onValueChange, 300),
    [],
  );

  const handleValueChange = (newValue: string) => {
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
        <Input
          type="text"
          name="notes"
          placeholder={placeholder}
          onChange={handleValueChange}
          value={value}
          $textColor="white"
          $noBorder
        />
      </CustomInputSend>
    </Container>
  );
};

NotesInput.defaultProps = {
  placeholder: '',
  initialValue: '',
};
