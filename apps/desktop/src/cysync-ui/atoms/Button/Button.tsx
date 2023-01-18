import { ButtonStyle, ButtonProps } from "./Button.style";

export const Button = ({ children, ...props }: ButtonProps): JSX.Element => {
  return (
    <>
      <ButtonStyle {...props}>{children}</ButtonStyle>
    </>
  );
};
