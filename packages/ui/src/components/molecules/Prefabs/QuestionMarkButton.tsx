import React from 'react';
import { Button, Typography } from '../../atoms';

export const QuestionMarkButton: React.FC = () => (
  <Button variant="none" color="golden" onClick={e => e.preventDefault()}>
    <Typography variant="h5" color="gold">
      ?
    </Typography>
  </Button>
);
