import {
  Container,
  Flex,
  LangDisplay,
  Toggle,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useToggleState } from '~/hooks';

interface ToggleSectionProps {
  single: any;
}

const ToggleSection: React.FC<ToggleSectionProps> = ({ single }) => {
  const {
    isChecked: isCheckedReplace,
    handleToggleChange: handleToggleChangeReplace,
  } = useToggleState();
  const {
    isChecked: isCheckedUnconfirmed,
    handleToggleChange: handleToggleChangeUnconfirmed,
  } = useToggleState();

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

      <Typography
        variant="span"
        width="100%"
        color="error"
        $alignSelf="start"
        $fontSize={12}
      >
        <LangDisplay text={single.fees.error} />
      </Typography>
    </Container>
  );
};

export default ToggleSection;
