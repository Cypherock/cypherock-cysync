import React from 'react';
import { Flex, Typography, Button, LangDisplay } from '../atoms';

export interface HelpHeaderProps {
  text: string;
}

export const HelpHeader: React.FC<HelpHeaderProps> = ({ text }) => (
  <Button variant="none">
    <Flex gap={8}>
      <Typography color="muted" fontSize={14}>
        <LangDisplay text={text} />
      </Typography>
      <Typography color="gold" fontSize={14}>
        ?
      </Typography>
    </Flex>
  </Button>
);
