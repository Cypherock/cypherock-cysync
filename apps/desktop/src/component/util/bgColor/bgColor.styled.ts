import { css } from "styled-components";

export type BgColorProps = {
  bgColor?: "contentGratient" | "sideBar" | "list" | "black" | "white";
};

export const bgColor = css`
  ${(props: BgColorProps) => {
    return (
      props.bgColor === "contentGratient" &&
      css`
        background-image: ${({ theme }) =>
          theme.palette.background.contentBackground};
      `
    );
  }}

  ${(props: BgColorProps) => {
    return (
      props.bgColor === "sideBar" &&
      css`
        background-image: ${({ theme }) =>
          theme.palette.background.sideBarBackground};
      `
    );
  }}

${(props: BgColorProps) => {
    return (
      props.bgColor === "list" &&
      css`
        background-color: #27221d;
      `
    );
  }}


${(props: BgColorProps) => {
    return (
      props.bgColor === "black" &&
      css`
        background-color: #000;
      `
    );
  }}
  ${(props: BgColorProps) => {
    return (
      props.bgColor === "white" &&
      css`
        background-color: #fff;
      `
    );
  }}
`;
