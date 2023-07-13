import styled from 'styled-components';
import { spacing } from '../utils';

interface LeanBoxContainerProps {
  padding?: string;
}

export const LeanBoxContainer = styled.div<LeanBoxContainerProps>`
  display: flex;
  ${spacing};
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;
