import {
  Container,
  Flex,
  Input,
  LangDisplay,
  Typography,
  CustomInputSend,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

interface NotesInputProps {
  label: any;
  placeholder?: any;
  onChange?: (value: string) => void;
}

export const NotesInput: React.FC<NotesInputProps> = ({
  label,
  placeholder,
  onChange,
}) => {
  const [value, setValue] = useState('');

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
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
  onChange: undefined,
};
