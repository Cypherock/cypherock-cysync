import React from 'react';
import { useToggle } from '../../hooks';
import { Container, Flex, LangDisplay, Toggle, Typography } from '../../atoms';

interface ToggleSectionProps {
  single: any;
  error: string;
}

export const ToggleSection: React.FC<ToggleSectionProps> = ({
  single,
  error,
}) => {
  const {
    isChecked: isCheckedReplace,
    handleToggleChange: handleToggleChangeReplace,
  } = useToggle();
  const {
    isChecked: isCheckedUnconfirmed,
    handleToggleChange: handleToggleChangeUnconfirmed,
  } = useToggle();

  return (
    <Container display="flex" direction="column" gap={16} width="full">
      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={8}>
          <Typography variant="span" width="100%" color="muted" $fontSize={13}>
            <LangDisplay text={single.toggleText.replace} />
          </Typography>
        </Flex>
        <Flex align="center" direction="row" gap={8}>
          <Toggle
            checked={isCheckedReplace}
            onToggle={handleToggleChangeReplace}
          />
        </Flex>
      </Flex>

      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={8}>
          <Typography variant="span" width="100%" color="muted" $fontSize={13}>
            <LangDisplay text={single.toggleText.unconfirmed} />
          </Typography>
        </Flex>
        <Flex align="center" direction="row" gap={8}>
          <Toggle
            checked={isCheckedUnconfirmed}
            onToggle={handleToggleChangeUnconfirmed}
          />
        </Flex>
      </Flex>
      {!error && (
        <Typography
          variant="span"
          width="100%"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          <LangDisplay text={error} />
        </Typography>
      )}
    </Container>
  );
};
