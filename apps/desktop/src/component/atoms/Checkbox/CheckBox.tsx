import { SquareCheckBoxStyle, SquareCheckBoxProps } from "./CheckBox.styled";

export const CheckBox = ({
  children,
  variation,
  ...props
}: SquareCheckBoxProps): JSX.Element => {
  return (
    <>
      {variation === "squareCheckBox" ? (
        <SquareCheckBoxStyle {...props}>{children}</SquareCheckBoxStyle>
      ) : (
        ""
      )}
    </>
  );
};
