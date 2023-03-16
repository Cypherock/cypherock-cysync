import { ButtonStyle, ButtonProps } from "./Button.styled";
import { FC } from "react";

export const Button: FC<ButtonProps> = ({ children, ...props }) => { 
  return (
      <ButtonStyle
        onClick={props.onClick}
        disabled={props.disabled}
        {...props}>{children}
      </ButtonStyle>
  );
};
