import {
  IStellarMemo,
  IStellarMemoType,
} from '@cypherock/coin-support-stellar';
import {
  Container,
  Flex,
  LangDisplay,
  Typography,
  CustomInputSend,
  Input,
  DropDownItemProps,
  Dropdown,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';

interface MemoTypeOption {
  value: IStellarMemoType;
  label: string;
}

interface StellarMemoInputProps {
  label: string;
  inputPlaceholder: {
    none: string;
    text: string;
    id: string;
    hash: string;
    return: string;
  };
  dropdownPlaceholder: string;
  searchText: string;
  initialValue?: IStellarMemo;
  onChange: (memo: IStellarMemo) => Promise<void>;
  memoTypes: MemoTypeOption[];
  error?: string;
  isDisabled?: boolean;
}

export const StellarMemoInput: React.FC<StellarMemoInputProps> = ({
  label,
  inputPlaceholder,
  dropdownPlaceholder,
  searchText,
  initialValue,
  onChange,
  memoTypes,
  error,
  isDisabled,
}) => {
  const [selectedType, setSelectedType] = useState<
    IStellarMemoType | undefined
  >(initialValue?.type);
  const [memoValue, setMemoValue] = useState<string>(initialValue?.value ?? '');

  const debouncedOnChange = useCallback(
    lodash.debounce((memo: IStellarMemo) => {
      onChange(memo);
    }, 300),
    [onChange],
  );

  const getPlaceholderText = (type?: IStellarMemoType): string => {
    switch (type) {
      case IStellarMemoType.TEXT:
        return inputPlaceholder.text;
      case IStellarMemoType.ID:
        return inputPlaceholder.id;
      case IStellarMemoType.HASH:
        return inputPlaceholder.hash;
      case IStellarMemoType.RETURN:
        return inputPlaceholder.return;
      default:
        return '';
    }
  };

  const handleTypeChange = (type: IStellarMemoType) => {
    setSelectedType(type);

    if (!type || type === IStellarMemoType.NONE) {
      setMemoValue('');
      debouncedOnChange({ type, value: '' });
    } else {
      debouncedOnChange({ type, value: memoValue });
    }
  };

  const handleValueChange = (value: string) => {
    if (!selectedType || selectedType === IStellarMemoType.NONE) return;

    setMemoValue(value);
    debouncedOnChange({ type: selectedType, value });
  };

  const disableInput = useMemo(
    () => !selectedType || selectedType === IStellarMemoType.NONE || isDisabled,
    [selectedType, isDisabled],
  );

  const memoTypeDropdownList: DropDownItemProps[] = useMemo(
    () =>
      memoTypes.map(memoType => ({
        id: memoType.value,
        text: memoType.label,
        checkType: 'radio',
      })),
    [memoTypes],
  );

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
      </Flex>

      <Flex $alignSelf="stretch" gap={8} align="flex-start" width="full">
        <Container align="center" width="140px" justify="space-between">
          <Dropdown
            items={memoTypeDropdownList}
            selectedItem={selectedType}
            searchText={searchText}
            placeholderText={dropdownPlaceholder}
            onChange={(typeValue?: string) =>
              typeValue && handleTypeChange(typeValue as IStellarMemoType)
            }
            autoFocus={false}
            noLeftImageInList
            disabled={isDisabled}
          />
        </Container>
        <Container
          align="center"
          $flex="1 0 0"
          $alignSelf="stretch"
          $minHeight="40px"
        >
          <CustomInputSend>
            <Input
              type="text"
              name="stellarMemo"
              placeholder={getPlaceholderText(selectedType)}
              onChange={handleValueChange}
              disabled={disableInput}
              value={memoValue}
              $textColor="white"
              $noBorder
            />
          </CustomInputSend>
        </Container>
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

StellarMemoInput.defaultProps = {
  error: undefined,
  isDisabled: undefined,
  initialValue: undefined,
};
