import React, { FC } from 'react';
import styled from 'styled-components';
import { utils, UtilsProps } from '../utils';
import { Typography } from '../atoms';
import { Clipboard } from './Clipboard';

interface CopyContainerProps extends UtilsProps {
  link: string;
}

const MaskStyle = styled.div<Omit<CopyContainerProps, 'link'>>`
  width: 100%;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.input};
  display: flex;
  border: 1px solid ${({ theme }) => theme.palette.border.input};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  ${utils}
`;
export const CopyContainer: FC<CopyContainerProps> = ({ link, ...props }) => (
  <MaskStyle {...props}>
    <Typography color="muted" variant="p">
      {link}
    </Typography>
    <Clipboard content={link} size="md" />
  </MaskStyle>
);
