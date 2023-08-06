import React from 'react';
import styled from 'styled-components';

import { goldenGradient } from '../utils';

interface MiniButtonProps {
  onClick?: () => void;
  shape?: string;
}

const MiniButtonWrapper = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  ${goldenGradient('background')};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.palette.background.black};
`;

export const MiniButton: React.FC<MiniButtonProps> = ({
  onClick,
  shape = '-',
}) => <MiniButtonWrapper onClick={onClick}>{shape}</MiniButtonWrapper>;

MiniButton.defaultProps = {
  onClick: undefined,
  shape: '-',
};
