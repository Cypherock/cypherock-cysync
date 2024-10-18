import { FeesInput } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

interface XrpInputProps {
  initialValue: number;
  unit: string;
  onChange: (newValue: number) => void;
}

export const XrpInput: React.FC<XrpInputProps> = ({
  initialValue,
  unit,
  onChange,
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (val: number) => {
    setValue(val);
    onChange(val);
  };

  return (
    <FeesInput
      value={value.toString()}
      postfixText={unit}
      onChange={handleChange}
      valueType="float"
    />
  );
};
