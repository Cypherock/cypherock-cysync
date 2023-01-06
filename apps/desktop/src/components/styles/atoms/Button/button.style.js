import styled, { css } from "styled-components";

const buttonBaseStyle = css`
  ${(props) => {
    return (
      props.secondary &&
      css`
        border: 2px solid #49433e;
        background-color: ${({ theme }) =>
          theme.palette.background.sepratorBackground};
        color: ${({ theme }) => theme.palette.text.textMuted};
      `
    );
  }}

  ${(props) => {
    return (
      props.primary &&
      css`
        background-image: ${({ theme }) => theme.palette.primary.primary};
      `
    );
  }}
`;

export const Button = styled.button`
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  border-radius: 6px;
  display: inline-block;
  padding-top: ${({ theme }) => theme.spacing.one.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  ${buttonBaseStyle}
`;
