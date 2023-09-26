import React from 'react';

import { Flex, LangDisplay, Toggle, Typography } from '../../atoms';

interface ToggleSectionProps {
  text: string;
  value: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
  errorText?: string;
}

export const ToggleSection: React.FC<ToggleSectionProps> = ({
  text,
  value,
  onChange,
  error,
  errorText = '',
}) => (
  <>
    <Flex justify="space-between" align="center" width="full">
      <Flex align="center" gap={8}>
        <Typography variant="span" color="muted" $fontSize={13}>
          <LangDisplay text={text} />
        </Typography>
      </Flex>
      <Flex align="center" direction="row" gap={8}>
        <Toggle checked={value} onToggle={onChange} />
      </Flex>
    </Flex>

    {error && (
      <Typography
        variant="span"
        color="error"
        $alignSelf="start"
        $fontSize={12}
      >
        <LangDisplay text={errorText} />
      </Typography>
    )}
  </>
);

ToggleSection.defaultProps = {
  error: false,
  errorText: '',
};
