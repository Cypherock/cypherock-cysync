import styled, { css } from "styled-components";
import { margin } from "../../util";

//outline
//lg
//gold
//success
//failed
//muted

type BulletProps = {
  outline?: Boolean;
  lg?: Boolean;
  gold?: Boolean;
  success?: Boolean;
  failed?: Boolean;
  muted?: Boolean;
};

export const BulletContainer = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.text.textHeading};
  ${margin}

  ${(props: BulletProps) => {
    return (
      props.outline &&
      css`
        width: 16px;
        height: 16px;
        border: 2px solid red;
        border-color: ${({ theme }) => theme.palette.text.textMuted};
        background-color: transparent;
      `
    );
  }}

  ${(props: BulletProps) => {
    return (
      props.lg &&
      css`
        width: 16px;
        height: 16px;
      `
    );
  }}

  ${(props: BulletProps) => {
    return (
      props.gold &&
      css`
        background-image: ${({ theme }) => theme.palette.primary.primary};
      `
    );
  }}

  ${(props: BulletProps) => {
    return (
      props.success &&
      css`
        background-color: ${({ theme }) => theme.palette.success.main};
      `
    );
  }}

${(props: BulletProps) => {
    return (
      props.failed &&
      css`
        background-color: ${({ theme }) => theme.palette.warning.main};
      `
    );
  }}

${(props: BulletProps) => {
    return (
      props.muted &&
      css`
        background-color: ${({ theme }) => theme.palette.text.textMuted};
      `
    );
  }}
`;
