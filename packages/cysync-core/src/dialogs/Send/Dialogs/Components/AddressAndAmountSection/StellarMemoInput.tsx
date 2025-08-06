import {
  Container,
  Flex,
  LangDisplay,
  Typography,
  CustomInputSend,
  Input,
  Breadcrumb,
} from '@cypherock/cysync-ui';
import { StellarMemoType } from '@cypherock/coin-support-stellar';
import lodash from 'lodash';
import React, { useCallback, useState, useEffect } from 'react';

interface MemoTypeOption {
  value: StellarMemoType;
  label: string;
}

interface StellarMemoInputProps {
  label: string;
  placeholder: string;
  initialValue?: string;
  initialType?: StellarMemoType;
  onChange: (type: StellarMemoType, value?: string) => Promise<void>;
  memoTypes: MemoTypeOption[];
  error?: string;
  isDisabled?: boolean;
}

export const StellarMemoInput: React.FC<StellarMemoInputProps> = ({
  label,
  placeholder,
  initialValue,
  initialType = StellarMemoType.NONE,
  onChange,
  memoTypes,
  error,
  isDisabled,
}) => {
  const [selectedType, setSelectedType] = useState<StellarMemoType>(initialType);
  const [value, setValue] = useState<string>(initialValue ?? '');
  const [validationError, setValidationError] = useState<string>('');

  const debouncedOnChange = useCallback(
    lodash.debounce((type: StellarMemoType, val?: string) => {
      onChange(type, val);
    }, 300),
    [onChange],
  );

  // Validate memo value based on type
  const validateMemoValue = (type: StellarMemoType, val: string): string => {
    if (type === StellarMemoType.NONE) return '';
    
    switch (type) {
      case StellarMemoType.TEXT:
        // TEXT memo: max 28 bytes
        if (Buffer.byteLength(val, 'utf8') > 28) {
          return 'Text memo exceeds 28 bytes';
        }
        break;
      
      case StellarMemoType.ID:
        // ID memo: 0 to 18446744073709551615 (64-bit unsigned integer)
        if (!/^\d+$/.test(val)) {
          return 'ID memo must be a number';
        }
        const idValue = BigInt(val);
        const maxUint64 = BigInt('18446744073709551615');
        if (idValue > maxUint64) {
          return 'ID memo exceeds maximum value';
        }
        break;
      
      case StellarMemoType.HASH:
      case StellarMemoType.RETURN:
        // HASH/RETURN memo: 32 bytes in hex (64 hex characters)
        if (!/^[0-9a-fA-F]{64}$/.test(val)) {
          return 'Hash memo must be 64 hexadecimal characters';
        }
        break;
      
      default:
        break;
    }
    
    return '';
  };

  const getPlaceholder = (type: StellarMemoType): string => {
    switch (type) {
      case StellarMemoType.TEXT:
        return 'Enter text memo (max 28 bytes)';
      case StellarMemoType.ID:
        return 'Enter numeric ID';
      case StellarMemoType.HASH:
        return 'Enter 64-character hex hash';
      case StellarMemoType.RETURN:
        return 'Enter 64-character hex return hash';
      default:
        return placeholder;
    }
  };

  const handleTypeChange = (newType: StellarMemoType) => {
    setSelectedType(newType);
    setValidationError('');
    
    if (newType === StellarMemoType.NONE) {
      setValue('');
      debouncedOnChange(newType);
    } else {
      const error = validateMemoValue(newType, value);
      setValidationError(error);
      if (!error) {
        debouncedOnChange(newType, value);
      }
    }
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    
    if (selectedType === StellarMemoType.NONE) return;
    
    // Don't validate empty values
    if (!newValue.trim()) {
      setValidationError('');
      debouncedOnChange(selectedType, newValue);
      return;
    }
    
    const error = validateMemoValue(selectedType, newValue);
    setValidationError(error);
    
    if (!error) {
      debouncedOnChange(selectedType, newValue);
    }
  };

  // Update when external props change
  useEffect(() => {
    setSelectedType(initialType);
  }, [initialType]);

  useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  // Create breadcrumb items for memo type dropdown
  const breadcrumbItems = [
    {
      id: 'memo-type',
      dropdown: {
        displayNode: (
          <Container direction="row">
            <Typography ml={1} color="white" $fontSize={14}>
              {memoTypes.find(type => type.value === selectedType)?.label || 'None'}
            </Typography>
          </Container>
        ),
        selectedItem: selectedType,
        setSelectedItem: (typeValue: string | undefined) => {
          if (typeValue) {
            handleTypeChange(typeValue as StellarMemoType);
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

  const showInput = selectedType !== StellarMemoType.NONE;
  const displayError = error || validationError;

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
                placeholder={getPlaceholder(selectedType)}
                onChange={handleValueChange}
                disabled={isDisabled}
                value={value}
                $textColor="white"
                $noBorder
              />
            ) : (
              <div style={{ height: '100%' }} />
            )}
          </Container>
        </Flex>
      </CustomInputSend>

      {/* Error Display */}
      {displayError && (
        <Typography
          variant="span"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          {displayError}
        </Typography>
      )}
    </Container>
  );
};

StellarMemoInput.defaultProps = {
  initialValue: undefined,
  initialType: StellarMemoType.NONE,
  error: undefined,
  isDisabled: undefined,
};