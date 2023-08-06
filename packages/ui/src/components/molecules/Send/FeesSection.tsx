import React from 'react';

import SvgGoldQuestionMark from '../../../assets/icons/generated/GoldQuestionMark';
import { Flex, LangDisplay, Typography } from '../../atoms';
import { ButtonGroup } from '../ButtonGroup';

interface FeesSectionProps {
  activeButtonId: number;
  handleButtonClick: (id: number) => void;
  single: any;
  Buttons: any;
}

export const FeesSection: React.FC<FeesSectionProps> = ({
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
