import MarkedReact from 'marked-react';
import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  text-align: left;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${({ theme }) => theme.palette.text.white};
  }
  p,
  ul,
  ol,
  li {
    color: ${({ theme }) => theme.palette.text.muted};
  }
  ul,
  ol {
    padding-left: 16px;
  }
`;

export interface MarkdownProps {
  children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => (
  <StyledContainer>
    <MarkedReact>{children}</MarkedReact>
  </StyledContainer>
);
