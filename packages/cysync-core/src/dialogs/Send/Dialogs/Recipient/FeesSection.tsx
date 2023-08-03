import {
  Flex,
  Typography,
  ButtonGroup,
  LangDisplay,
} from '@cypherock/cysync-ui';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import React from 'react';

interface FeesSectionProps {
  activeButtonId: number;
  handleButtonClick: (id: number) => void;
  single: any; // Make sure to replace 'any' with the actual type of 'single'.
  Buttons: any; // Make sure to replace 'any' with the actual type of 'Buttons'.
}

const FeesSection: React.FC<FeesSectionProps> = ({
  activeButtonId,
  handleButtonClick,
  single,
  Buttons,
}) => (
  <Flex justify="space-between" align="center" width="full">
    <Flex align="center" gap={8}>
      <Typography variant="span" width="100%" $fontSize={13}>
        <LangDisplay text={single.fees.title} />
      </Typography>
      <SvgGoldQuestionMark height={14} width={14} />
    </Flex>
    <Flex align="center" direction="row" gap={8}>
      <ButtonGroup
        buttons={Buttons}
        activeButtonId={activeButtonId}
        onButtonClick={handleButtonClick}
      />
    </Flex>
  </Flex>
);

export default FeesSection;
