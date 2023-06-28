import React, { FC } from 'react';
import styled from 'styled-components';

import { Typography } from '../../atoms';

interface NameBoxProps {
  text: string;
}

const NameBoxStyle = styled.div`
  padding: 16px 0 16px 40px;
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;
`;

export const NameBox: FC<NameBoxProps> = ({ text }) => (
  <NameBoxStyle>
    <Typography variant="p" color="muted">
      {text}
    </Typography>
  </NameBoxStyle>
);
