import {
  Flex,
  LangDisplay,
  Typography,
  PillButtonToggle,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { FeesHeaderProps } from './FeesHeader';

export const FeesTitle: React.FC<FeesHeaderProps> = ({
  initialState,
  onChange,
  title,
}) => {
  const lang = useAppSelector(selectLanguage);
  const buttons = lang.strings.send.fees.header;
  const [isToggled, setIsToggled] = React.useState(initialState);

  const handleChange = (switchedTo: string) => {
    const isFirst =
      buttons.findIndex(button => button.type === switchedTo) === 0;
    setIsToggled(!isFirst);
    onChange(!isFirst);
  };

  return (
    <Flex justify="space-between" align="center" width="full">
      <Flex align="center" gap={8}>
        <Typography variant="span" $fontSize={14}>
          <LangDisplay text={title} />
        </Typography>
      </Flex>
      <Flex align="center" direction="row" gap={8}>
        <PillButtonToggle
          buttons={buttons}
          type={isToggled ? buttons[1].type : buttons[0].type}
          onButtonClick={handleChange}
        />
      </Flex>
    </Flex>
  );
};
