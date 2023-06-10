import React from 'react';
import { Flex, Typography, Button, LangDisplay, Image } from '../../atoms';
import { backIcon } from '../../..';

export interface BackButtonProps {
  text: string;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ text, onClick }) => (
  <Button variant="none" onClick={onClick}>
    <Flex gap={8}>
      <Image src={backIcon} alt="Back" />
      <Typography color="muted" fontSize={14}>
        <LangDisplay text={text} />
      </Typography>
    </Flex>
  </Button>
);

BackButton.defaultProps = {
  onClick: undefined,
};
