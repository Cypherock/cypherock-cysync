import {
  Container,
  Flex,
  LangDisplay,
  Typography,
  CustomInputSend,
  Input,
  Tooltip,
  QuestionMarkButton,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

interface CantonMemoInputProps {
  label: string;
  tooltipText?: string;
  placeholder: string;
  initialValue?: string;
  onChange: (value: string) => Promise<void>;
}

export const CantonMemoInput: React.FC<CantonMemoInputProps> = ({
  label,
  tooltipText,
  placeholder,
  initialValue,
  onChange,
}) => {
  const lang = useAppSelector(selectLanguage);

  const [value, setValue] = useState<string>(initialValue ?? '');
  const [error, setError] = useState('');

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onChange, 300),
    [],
  );

  const handleValueChange = (newValue: string) => {
    if (newValue.length <= 255) {
      setValue(newValue);
      setError('');
      debouncedOnValueChange(newValue);
    } else {
      setError(lang.strings.send.recipient.cantonMemo.error);
    }
  };

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex align="center" width="full" gap={4}>
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
        {tooltipText && (
          <Tooltip tooltipPlacement="bottom" text={tooltipText}>
            <QuestionMarkButton />
          </Tooltip>
        )}
      </Flex>
      <CustomInputSend>
        <Input
          type="text"
          name="memo"
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

CantonMemoInput.defaultProps = {
  initialValue: undefined,
  tooltipText: undefined,
};
