import React from 'react';

import { Flex, Typography, Button, LangDisplay } from '../../atoms';

export interface HelpButtonProps {
  text: string;
  onClick?: () => void;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ text, onClick }) => (
  <Button variant="none" onClick={onClick}>
    <Flex gap={8}>
      <Typography color="muted" $fontSize={14}>
        <LangDisplay text={text} />
      </Typography>
      <Typography color="gold" $fontSize={14}>
        ?
      </Typography>
    </Flex>
  </Button>
);

HelpButton.defaultProps = {
  onClick: undefined,
};
