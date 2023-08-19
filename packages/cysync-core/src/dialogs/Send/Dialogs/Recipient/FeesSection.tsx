import React from 'react';
import {
  GoldQuestionMark,
  Flex,
  LangDisplay,
  Typography,
  ButtonAttributes,
  PillButtonToggle,
} from '@cypherock/cysync-ui';

interface FeesSectionProps {
  type: 'slider' | 'input';
  handleButtonClick: (type: 'slider' | 'input') => void;
  title: string;
  Buttons: ButtonAttributes[];
}

export const FeesSection: React.FC<FeesSectionProps> = ({
  type,
  handleButtonClick,
  title,
  Buttons,
}) => (
  <Flex justify="space-between" align="center" width="full">
    <Flex align="center" gap={8}>
      <Typography variant="span" width="100%" $fontSize={14}>
        <LangDisplay text={title} />
      </Typography>
      <GoldQuestionMark height={14} width={14} />
    </Flex>
    <Flex align="center" direction="row" gap={8}>
      <PillButtonToggle
        buttons={Buttons}
        type={type}
        onButtonClick={handleButtonClick}
      />
    </Flex>
  </Flex>
);
