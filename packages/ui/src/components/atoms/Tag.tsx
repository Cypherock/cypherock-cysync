import React, { FC } from 'react';
import styled from 'styled-components';
import { colors } from '../../themes/color.styled';

interface TagProps {
  children: React.ReactNode;
}

const StyledTag = styled.div`
  padding: 0px 8px;
  color: ${colors.text.muted};
  border-radius: 4px;
  border: 1px solid ${colors.border.muted};
  font-size: 10px;
  font-weight: 500;
  font-family: 'Poppins';
  align-self: flex-start;
  flex-shrink: 0;
`;

export const Tag: FC<TagProps> = ({ children }) => (
  <StyledTag>{children}</StyledTag>
);
