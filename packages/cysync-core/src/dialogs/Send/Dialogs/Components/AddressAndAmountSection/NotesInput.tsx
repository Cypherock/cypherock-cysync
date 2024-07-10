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

import { selectLanguage, useAppSelector } from '~/store';

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
  const [error, setError] = useState('');
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;

  const onValueChange = async (val: string) => {
    if (!error) {
      await onChange(val);
    }
  };

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onValueChange, 300),
    [error],
  );

  const handleValueChange = (newValue: string) => {
    if (newValue.length <= 120) {
      setValue(newValue);
      setError('');
      debouncedOnValueChange(newValue);
    } else {
      setError(displayText.remarks.error);
    }
  };

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
      </Flex>
      <CustomInputSend error={error}>
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

NotesInput.defaultProps = {
  placeholder: '',
  initialValue: '',
};
