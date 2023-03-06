import { css } from "styled-components";

export interface BgColorProps {
  bgColor?: "contentGratient" | "sideBar" | "list" | "black" | "white";
};

export const bgColor = css<BgColorProps>`
  ${(props) => {
    return (
      props.bgColor === "contentGratient" &&
      css`
        background-image: ${({ theme }) =>
          theme.palette.background.contentBackground};
      `
    );
  }}

  ${(props) => {
    return (
      props.bgColor === "sideBar" &&
      css`
        background-image: ${({ theme }) =>
          theme.palette.background.sideBarBackground};
      `
    );
  }}

${(props) => {
    return (
      props.bgColor === "list" &&
      css`
        background-color: #27221d;
      `
    );
  }}


${(props) => {
    return (
      props.bgColor === "black" &&
      css`
        background-color: #000;
      `
    );
  }}
  ${(props) => {
    return (
      props.bgColor === "white" &&
      css`
        background-color: #fff;
      `
    );
  }}
`;
