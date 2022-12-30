import styled from "styled-components";

export const Button = styled.button`
  border-radius: 6px;
  display: inline-block;
  background-image: ${({ theme, button }) =>
    button == "primary" ? theme.palette.primary.primary : ""};
  background-color: ${({ theme, button }) =>
    button == "secondary" ? theme.palette.background.sepratorBackground : ""};
  border-color: ${({ theme, button }) =>
    button == "secondary" ? "#49433E" : ""};
  border-width: ${({ button }) => (button == "secondary" ? "1px" : "")};
  border-style: ${({ button }) => (button == "secondary" ? "solid" : "")};
  padding-top: ${({ theme }) => theme.spacing.one.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};

  span {
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme, button }) =>
      button == "secondary" ? theme.palette.text.mutedText : ""};
  }
`;
