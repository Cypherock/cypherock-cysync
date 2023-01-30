import { css } from "styled-components";

export type BgColorProps = {
  contentGratient?: Boolean;
  sideBar?: Boolean;
  list?: any;
  black?: Boolean;
};

export const bgColor = css`
  ${(props: BgColorProps) => {
    return (
      props.contentGratient &&
      css`
        background-image: ${({ theme }) =>
          theme.palette.background.contentBackground};
      `
    );
  }}

  ${(props: BgColorProps) => {
    return (
      props.sideBar &&
      css`
        background-image: ${({ theme }) =>
          theme.palette.background.sideBarBackground};
      `
    );
  }}

${(props: BgColorProps) => {
    return (
      props.list &&
      css`
        background-color: #27221d;
      `
    );
  }}


${(props: BgColorProps) => {
    return (
      props.black &&
      css`
        background-color: #000;
      `
    );
  }}
`;
