import React, { FC } from 'react';
import styled from 'styled-components';
import { colors } from '../../themes/color.styled';
import { FontProps, SpacingProps, font, spacing } from '../utils';

interface TagProps extends SpacingProps, FontProps {
  children: React.ReactNode;
}

const StyledTag = styled.div<TagProps>`
  padding: 0px 8px;
  color: ${colors.text.muted};
  border-radius: 4px;
  border: 1px solid ${colors.border.muted};
  font-size: 10px;
  font-weight: 500;
  font-family: 'Poppins';
  align-self: flex-start;
  flex-shrink: 0;
  ${spacing}
  ${font}
`;

export const Tag: FC<TagProps> = ({ children, ...props }) => (
  <StyledTag {...props}>{children}</StyledTag>
);
