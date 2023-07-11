import React, { FC } from 'react';
import styled from 'styled-components';

interface TagProps {
  children: React.ReactNode;
  // other props you may need for your tag
}

const StyledTag = styled.div`
  padding: 0px 8px;
  color: #8b8682;
  border-radius: 4px;
  border: 1px solid #8b8682;
  font-size: 10px;
  font-weight: 500;
  font-family: 'Poppins';
  align-self: flex-start;
  flex-shrink: 0;
  // other styles you may need
`;

export const Tag: FC<TagProps> = ({ children }) => (
  <StyledTag>{children}</StyledTag>
);
