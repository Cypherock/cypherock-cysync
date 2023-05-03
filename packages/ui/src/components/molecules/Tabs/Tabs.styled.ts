import { ReactNode } from 'react';
import styled from 'styled-components';
import { UtilsProps, utils } from '../../util';

export interface TabProps extends UtilsProps {
  children?: ReactNode;
}

export const TabStyle = styled.button<TabProps>`
  ${utils}
  cursor: pointer;
  border: none;
  background-color: transparent;
`;
