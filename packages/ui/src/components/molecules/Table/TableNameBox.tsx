import React, { FC } from 'react';
import styled from 'styled-components';

import { Tooltip, Typography } from '../../atoms';
import { UtilsProps, utils } from '../../utils';

interface NameBoxProps extends UtilsProps {
  text: string;
  showTooltip?: boolean;
}

const NameBoxStyle = styled.div<NameBoxProps>`
  padding: 16px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;

  @media ${({ theme }) => theme.screens.lg} {
    padding: 16px 0 16px 40px;
  }
  ${utils}
`;

export const TableNameBox: FC<NameBoxProps> = ({ showTooltip, ...props }) => (
  <NameBoxStyle {...props}>
    <Tooltip text={props.text} isActive={showTooltip}>
      <Typography
        variant="p"
        color="muted"
        $whiteSpace="nowrap"
        $textOverflow="ellipsis"
      >
        {props.text}
      </Typography>
    </Tooltip>
  </NameBoxStyle>
);

TableNameBox.defaultProps = {
  showTooltip: false,
};
