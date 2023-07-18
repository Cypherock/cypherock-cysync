import styled from 'styled-components';
import { spacing } from '../utils';

export const LeanBoxContainer = styled.div`
  display: flex;
  ${spacing};
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  width: 100%;
`;
