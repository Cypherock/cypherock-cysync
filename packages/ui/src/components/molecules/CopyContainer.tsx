import React, { FC } from 'react';
import styled from 'styled-components';

import { Clipboard, ClipboardVariants } from './Clipboard';

import { Typography } from '../atoms';
import { utils, UtilsProps } from '../utils';

interface CopyContainerProps extends UtilsProps {
  link: string;
  variant?: ClipboardVariants;
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
export const CopyContainer: FC<CopyContainerProps> = ({
  link,
  variant,
  ...props
}) => (
  <MaskStyle {...props}>
    <Typography color="muted" variant="p">
      {link}
    </Typography>
    <Clipboard content={link} size="md" variant={variant} />
  </MaskStyle>
);

CopyContainer.defaultProps = {
  variant: 'white',
};
