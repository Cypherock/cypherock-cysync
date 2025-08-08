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
  Breadcrumb,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

interface MemoTypeOption {
  value: IStellarMemoType;
  label: string;
}

interface StellarMemoInputProps {
  label: string;
  placeholder: {
    none: string;
    text: string;
    id: string;
    hash: string;
    return: string;
  };
  initialValue: IStellarMemo;
  onChange: (memo: IStellarMemo) => Promise<void>;
  memoTypes: MemoTypeOption[];
  error?: string;
  isDisabled?: boolean;
}

export const StellarMemoInput: React.FC<StellarMemoInputProps> = ({
  label,
  placeholder,
  initialValue,
  onChange,
  memoTypes,
  error,
  isDisabled,
}) => {
  const [selectedType, setSelectedType] = useState<IStellarMemoType>(
    initialValue.type,
  );
  const [memoValue, setMemoValue] = useState<string>(initialValue.value ?? '');

  const debouncedOnChange = useCallback(
    lodash.debounce((memo: IStellarMemo) => {
      onChange(memo);
    }, 300),
    [onChange],
  );

  const getPlaceholderText = (type: IStellarMemoType): string => {
    switch (type) {
      case IStellarMemoType.TEXT:
        return placeholder.text;
      case IStellarMemoType.ID:
        return placeholder.id;
      case IStellarMemoType.HASH:
        return placeholder.hash;
      case IStellarMemoType.RETURN:
        return placeholder.return;
      default:
        return placeholder.none;
    }
  };

  const handleTypeChange = (type: IStellarMemoType) => {
    setSelectedType(type);

    if (type === IStellarMemoType.NONE) {
      setMemoValue('');
      debouncedOnChange({ type, value: '' });
    } else {
      debouncedOnChange({ type, value: memoValue });
    }
  };

  const handleValueChange = (value: string) => {
    if (selectedType === IStellarMemoType.NONE) return;

    setMemoValue(value);
    debouncedOnChange({ type: selectedType, value });
  };

  // Create breadcrumb items for memo type dropdown
  const breadcrumbItems = [
    {
      id: 'memo-type',
      dropdown: {
        displayNode: (
          <Container direction="row">
            <Typography ml={1} color="white" $fontSize={14}>
              {memoTypes.find(type => type.value === selectedType)?.label ??
                'None'}
            </Typography>
          </Container>
        ),
        selectedItem: selectedType,
        setSelectedItem: (typeValue: string | undefined) => {
          if (typeValue) {
            handleTypeChange(typeValue as IStellarMemoType);
          }
        },
        dropdown: memoTypes.map(type => ({
          text: type.label,
          id: type.value,
          displayNode: (
            <Container direction="row">
              <Typography ml={1} color="muted" $fontSize={14}>
                {type.label}
              </Typography>
            </Container>
          ),
        })),
      },
    },
  ];

  const showInput = selectedType !== IStellarMemoType.NONE;

  return (
    <Container display="flex" direction="column" width="full" gap={8}>
      <Flex justify="space-between" width="full">
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={label} />
        </Typography>
      </Flex>

      {/* Combined Memo Type Dropdown + Input Field */}
      <CustomInputSend>
        <Flex align="center" width="full">
          {/* Memo Type Dropdown */}
          <Container $minWidth="80px">
            <Breadcrumb items={breadcrumbItems} />
          </Container>

          {/* Memo Value Input - always show container for consistent height */}
          <Container $flex="1" ml={2} $minHeight="40px">
            {showInput ? (
              <Input
                type="text"
                name="stellarMemo"
                placeholder={getPlaceholderText(selectedType)}
                onChange={handleValueChange}
                disabled={isDisabled}
                value={memoValue}
                $textColor="white"
                $noBorder
              />
            ) : (
              <div style={{ height: '100%' }} />
            )}
          </Container>
        </Flex>
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

StellarMemoInput.defaultProps = {
  error: undefined,
  isDisabled: undefined,
};
