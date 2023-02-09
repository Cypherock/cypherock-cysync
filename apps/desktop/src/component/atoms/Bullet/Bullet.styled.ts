import styled, { css } from "styled-components";
import { margin } from "../../util";

export type BulletProps = {
  variant?: "outline" | "gold" | "success" | "failed" | "muted";
  size?: "lg" | "sm" | "md";
};

export const BulletStyle = styled.div`
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.text.textHeading};
  ${margin}

  //size
  ${(props: BulletProps) => {
    return (
      props.size === "sm" &&
      css`
        width: 8px;
        height: 8px;
      `
    );
  }}
  ${(props: BulletProps) => {
    return (
      props.size === "lg" &&
      css`
        width: 16px;
        height: 16px;
      `
    );
  }}

  //variant
  ${(props: BulletProps) => {
    return (
      props.variant === "outline" &&
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
      props.variant === "gold" &&
      css`
        background-image: ${({ theme }) => theme.palette.primary.primary};
      `
    );
  }}
  ${(props: BulletProps) => {
    return (
      props.variant === "success" &&
      css`
        background-color: ${({ theme }) => theme.palette.success.main};
      `
    );
  }}
  ${(props: BulletProps) => {
    return (
      props.variant === "failed" &&
      css`
        background-color: ${({ theme }) => theme.palette.warning.main};
      `
    );
  }}

  ${(props: BulletProps) => {
    return (
      props.variant === "muted" &&
      css`
        background-color: ${({ theme }) => theme.palette.text.textMuted};
      `
    );
  }}
`;
