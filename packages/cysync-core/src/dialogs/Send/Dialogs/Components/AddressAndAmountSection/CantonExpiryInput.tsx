import {
  cantonTransactionExpiryMap,
  ICantonTransactionExpiryInput,
  ICantonTransactionExpiryInputKey,
} from '@cypherock/coin-support-canton';
import {
  Container,
  Flex,
  LangDisplay,
  Typography,
  DropDownItemProps,
  Dropdown,
  QuestionMarkButton,
  Tooltip,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';

interface ICantonTransactionExpiryOption {
  value: ICantonTransactionExpiryInputKey;
  label: string;
}

export interface ICantonTransactionExpiryInputProps {
  label: string;
  tooltipText: string;
  dropdownPlaceholder: string;
  searchText?: string;
  initialValue?: ICantonTransactionExpiryInputKey;
  onChange: (expiry: ICantonTransactionExpiryInput) => Promise<void>;
  expiryOptions: ICantonTransactionExpiryOption[];
  error?: string;
  isDisabled?: boolean;
}

export const CantonTransactionExpiryInput: React.FC<
  ICantonTransactionExpiryInputProps
> = ({
  label,
  tooltipText,
  dropdownPlaceholder,
  searchText,
  initialValue,
  onChange,
  expiryOptions,
  error,
  isDisabled,
}) => {
  const [selectedExpiry, setSelectedExpiry] = useState<
    ICantonTransactionExpiryInputKey | undefined
  >(initialValue);

  const debouncedOnChange = useCallback(
    lodash.debounce((expiry: ICantonTransactionExpiryInput) => {
      onChange(expiry);
    }, 300),
    [onChange],
  );

  const handleValueChange = (selectedValue?: string) => {
    if (!selectedValue) return;

    const selectedExpiryValue =
      cantonTransactionExpiryMap[
        selectedValue as keyof typeof cantonTransactionExpiryMap
      ];

    if (!selectedExpiryValue) return;

    setSelectedExpiry(selectedValue as ICantonTransactionExpiryInputKey);
    debouncedOnChange({
      key: selectedValue as ICantonTransactionExpiryInputKey,
      value: selectedExpiryValue,
    });
  };

  const expiryOptionsDropDownList: DropDownItemProps[] = useMemo(
    () =>
      expiryOptions.map(expiryOption => ({
        id: expiryOption.value,
        text: expiryOption.label,
        checkType: 'radio',
      })),
    [expiryOptions],
  );

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex align="center" width="full" gap={4}>
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />{' '}
        </Typography>
        <Tooltip tooltipPlacement="bottom" text={tooltipText}>
          <QuestionMarkButton />
        </Tooltip>
      </Flex>

      <Flex $alignSelf="stretch" gap={8} align="flex-start" width="full">
        <Dropdown
          items={expiryOptionsDropDownList}
          selectedItem={selectedExpiry}
          searchText={searchText ?? ''}
          placeholderText={dropdownPlaceholder}
          onChange={handleValueChange}
          noLeftImageInList
          disabled={isDisabled}
        />
      </Flex>

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

CantonTransactionExpiryInput.defaultProps = {
  error: undefined,
  isDisabled: undefined,
  initialValue: undefined,
  searchText: undefined,
};
