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

import { selectLanguage, useAppSelector } from '~/store';

interface MemoInputProps {
  label: string;
  placeholder: string;
  initialValue?: string;
  onChange: (value: string) => Promise<void>;
  limit: BigNumber;
}

export const MemoInput: React.FC<MemoInputProps> = ({
  label,
  placeholder,
  initialValue,
  onChange,
  limit,
}) => {
  const lang = useAppSelector(selectLanguage);

  const [value, setValue] = useState<string>(initialValue ?? '');
  const [error, setError] = useState('');

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

    if (bigNum.isGreaterThanOrEqualTo(limit)) {
      setError(lang.strings.send.recipient.memo.error);
    } else {
      setError('');
    }

    while (filteredValue.length > 0 && bigNum.isGreaterThanOrEqualTo(limit)) {
      filteredValue = filteredValue.slice(0, filteredValue.length - 1);
      bigNum = new BigNumber(filteredValue);
    }

    setValue(filteredValue);
    debouncedOnValueChange(bigNum.toString());
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

MemoInput.defaultProps = {
  initialValue: undefined,
};
