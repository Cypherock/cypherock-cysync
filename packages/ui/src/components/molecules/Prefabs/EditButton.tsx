import React from 'react';

import { Button, Typography } from '../../atoms';

export interface EditButtonProps {
  text: string;
  onClick?: () => void;
}

export const EditButton: React.FC<EditButtonProps> = ({ text, onClick }) => (
  <Button variant="none" onClick={onClick}>
    <Typography $fontSize={14} $fontWeight="medium" color="gold">
      {text}
    </Typography>
  </Button>
);

EditButton.defaultProps = {
  onClick: undefined,
};
