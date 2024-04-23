import { RecipientAddress } from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useCallback, useState } from 'react';

interface AddressInputProps {
  label: string;
  placeholder?: string;
  initialValue?: string;
  onChange: (value: string) => Promise<void>;
  error?: string;
  showDeleteButton?: boolean;
  isButtonDisabled?: boolean;
  onDelete?: () => void;
  index?: number;
  isDisabled?: boolean;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  label,
  error,
  placeholder,
  initialValue,
  onChange,
  showDeleteButton,
  onDelete,
  index,
  isButtonDisabled,
  isDisabled,
}) => {
  const [value, setValue] = useState(initialValue ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const onValueChange = async (val: string) => {
    setIsLoading(true);
    await onChange(val);
    setIsLoading(false);
  };

  const debouncedOnValueChange = useCallback(
    lodash.debounce(onValueChange, 300),
    [],
  );

  const handleValueChange = (val: string) => {
    setValue(val);
    debouncedOnValueChange(val);
  };

  return (
    <RecipientAddress
      text={label}
      placeholder={placeholder ?? ''}
      error={error}
      value={value}
      onChange={handleValueChange}
      isThrobberActive={isLoading}
      deleteButton={showDeleteButton}
      onDelete={onDelete}
      index={index}
      isButtonDisabled={isButtonDisabled}
      isDisabled={isDisabled}
    />
  );
};

AddressInput.defaultProps = {
  initialValue: '',
  placeholder: '',
  error: '',
  isButtonDisabled: false,
  showDeleteButton: false,
  onDelete: undefined,
  index: undefined,
  isDisabled: undefined,
};
