import React, { FC } from 'react';
import styled from 'styled-components';

import { Clipboard, ClipboardVariants } from './Clipboard';

import { Typography, TypographyProps } from '../atoms';
import { utils, UtilsProps } from '../utils';

interface CopyContainerProps extends UtilsProps {
  link: string;
  copyValue?: string;
  variant?: ClipboardVariants;
  typographyProps?: TypographyProps;
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
  copyValue,
  typographyProps = {},
  ...props
}) => (
  <MaskStyle {...props}>
    <Typography
      color="muted"
      variant="p"
      mr={1}
      $wordBreak="break-all"
      {...typographyProps}
    >
      {link}
    </Typography>
    <Clipboard content={copyValue ?? link} size="md" variant={variant} />
  </MaskStyle>
);

CopyContainer.defaultProps = {
  variant: 'white',
  copyValue: undefined,
  typographyProps: {},
};
