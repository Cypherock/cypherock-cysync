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

export enum IExpirationDateInputType {
  THREE_HOURS = 3,
  ONE_DAY = 1,
  ONE_WEEK = 7,
  TEN_DAYS = 10,
  MONTH = 30,
}

interface IExpirationDateInputValue {
  type: IExpirationDateInputType;
  value: string;
}

interface ExpirationDateOption {
  value: IExpirationDateInputType;
  label: string;
}

interface ExpirationDateInputProps {
  label: string;
  tooltipText: string;
  dropdownPlaceholder: string;
  searchText: string;
  initialValue: IExpirationDateInputValue;
  onChange: (memo: IExpirationDateInputValue) => Promise<void>;
  expirationDateOptions: ExpirationDateOption[];
  error?: string;
  isDisabled?: boolean;
}

export const ExpirationDateInput: React.FC<ExpirationDateInputProps> = ({
  label,
  tooltipText,
  dropdownPlaceholder,
  searchText,
  initialValue,
  onChange,
  expirationDateOptions,
  error,
  isDisabled,
}) => {
  const [selectedDate, setSelectedDate] =
    useState<IExpirationDateInputValue>(initialValue);

  const debouncedOnChange = useCallback(
    lodash.debounce((expirationDate: IExpirationDateInputValue) => {
      onChange(expirationDate);
    }, 300),
    [onChange],
  );

  const handleValueChange = (selectedValue?: string) => {
    if (!selectedValue) return;

    const selectedType =
      IExpirationDateInputType[
        selectedValue as keyof typeof IExpirationDateInputType
      ];

    const expirationDateInputValue: IExpirationDateInputValue = {
      type: selectedType,
      value: selectedValue,
    };

    setSelectedDate(expirationDateInputValue);
    debouncedOnChange(expirationDateInputValue);
  };

  const expirationDateOptionsDropDownList: DropDownItemProps[] = useMemo(
    () =>
      expirationDateOptions.map(expirationDateOption => ({
        id: expirationDateOption.value.toString(),
        text: expirationDateOption.label,
        checkType: 'radio',
      })),
    [expirationDateOptions],
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
          items={expirationDateOptionsDropDownList}
          selectedItem={selectedDate.value.toString()}
          searchText={searchText}
          placeholderText={dropdownPlaceholder}
          onChange={handleValueChange}
          autoFocus={false}
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

ExpirationDateInput.defaultProps = {
  error: undefined,
  isDisabled: undefined,
};
