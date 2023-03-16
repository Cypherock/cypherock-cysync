import { alignSelf, width, WidthProps, AlignSelfProps } from "../../util";
import { MouseEvent, PropsWithChildren, ReactElement } from "react";
import styled, { css } from "styled-components";

type buttonVariation = "primary" | "secondary" | "dashedBorder" | "warning";

export type ButtonProps = PropsWithChildren<{
  disabled?: boolean;
  variation?: buttonVariation;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  width?: WidthProps;
  alignSelf?: AlignSelfProps;
}>;

// extends WidthProps, AlignSelfProps, React.ButtonHTMLAttributes<HTMLButtonElement>
const buttonBaseStyle = css<ButtonProps>`
  ${(props) => {
    switch (props.variation) {
      case "primary":
        return css`
          background-image: ${({ theme }) => theme.palette.primary.primary};
          border: none;
          font-size: 14px;
          font-weight: 500;
        `;                
      case "secondary":
        return css`
          border: 0.6px solid #49433e;
          background-color: ${({ theme }) =>
            theme.palette.background.sepratorBackground};
          color: ${({ theme }) => theme.palette.text.textMuted};
        `;    
      case "dashedBorder":
        return css`
          border: 1px dashed #49433e;
          background: transparent;
        `;    

      case "warning":
        return css`
          background: #FF624C;
          border: 0.6px solid #FF3518;
          border-radius: 6px;
          color: #FFFFFF; 
          font-weight: 500;
        `;  
      default:
        return css``;
    }
  }}`;
  

export const ButtonStyle = styled.button<ButtonProps>`
${(props) => {
  return css`
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
  ${width}
  ${alignSelf}`
}};
`;
