import styled, { css } from "styled-components";
import { margin } from "../../util/spacing/Spacing.styled";
// deafault white
export const Bullet = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.text.textHeading};
  ${margin}

  ${(props) => {
    return (
      props.gold &&
      css`
        background-image: ${({ theme }) => theme.palette.primary.primary};
      `
    );
  }}

  ${(props) => {
    return (
      props.success &&
      css`
        background-color: ${({ theme }) => theme.palette.success.main};
      `
    );
  }}

${(props) => {
    return (
      props.failed &&
      css`
        background-color: ${({ theme }) => theme.palette.warning.main};
      `
    );
  }}

${(props) => {
    return (
      props.muted &&
      css`
        background-color: ${({ theme }) => theme.palette.text.textMuted};
      `
    );
  }}
`;
