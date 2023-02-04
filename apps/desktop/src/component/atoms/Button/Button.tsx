import { ButtonStyle, ButtonProps } from "./Button.styled";

export const Button = ({ children, ...props }: ButtonProps): JSX.Element => {
  return <ButtonStyle {...props}>{children}</ButtonStyle>;
};
