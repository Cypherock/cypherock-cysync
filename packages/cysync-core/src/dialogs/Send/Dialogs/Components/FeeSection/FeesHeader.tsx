import {
  GoldQuestionMark,
  Flex,
  LangDisplay,
  Typography,
  ButtonAttributes,
  PillButtonToggle,
} from '@cypherock/cysync-ui';
import React from 'react';

const Buttons: ButtonAttributes[] = [
  { id: 1, label: 'Standard', type: 'slider' },
  { id: 2, label: 'Advanced', type: 'input' },
];

interface FeesHeaderProps {
  initialState: boolean;
  onChange: (isToggled: boolean) => void;
  title: string;
}

export const FeesHeader: React.FC<FeesHeaderProps> = ({
  initialState,
  onChange,
  title,
}) => {
  const [isToggled, setIsToggled] = React.useState(initialState);
  const handleChange = (switchedTo: string) => {
    const isFirst =
      Buttons.findIndex(button => button.type === switchedTo) === 0;
    setIsToggled(!isFirst);
    onChange(!isFirst);
  };
  return (
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
          type={isToggled ? Buttons[1].type : Buttons[0].type}
          onButtonClick={handleChange}
        />
      </Flex>
    </Flex>
  );
};
