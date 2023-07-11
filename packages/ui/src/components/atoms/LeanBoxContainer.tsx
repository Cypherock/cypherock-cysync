import styled from 'styled-components';

interface LeanBoxContainerProps {
  padding?: string;
}

export const LeanBoxContainer = styled.div<LeanBoxContainerProps>`
  display: flex;
  padding: ${({ padding }) => padding ?? '16px 40px 32px 0px'};
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
`;
