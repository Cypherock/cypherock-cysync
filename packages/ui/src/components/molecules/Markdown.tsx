import { Marked } from 'marked';
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
  h1 {
    text-align: center;
    margin: 32px 0;
  }
  h2,
  h3,
  li {
    margin: 16px 0;
  }
`;

const marked = new Marked({
  async: false,
  gfm: false,
});

export interface MarkdownProps {
  children: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ children }) => (
  <StyledContainer>
    <p dangerouslySetInnerHTML={{ __html: marked.parse(children) as string }} />
  </StyledContainer>
);
