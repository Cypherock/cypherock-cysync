import React from 'react';

import { Button, Typography } from '../../atoms';

export const QuestionMarkButton: React.FC = () => (
  <Button
    variant="none"
    color="golden"
    $borderColor="gold"
    $borderRadius={100}
    width={14}
    height={14}
    display="flex"
    justify="center"
    align="center"
  >
    <Typography color="gold" $fontSize={11}>
      ?
    </Typography>
  </Button>
);
