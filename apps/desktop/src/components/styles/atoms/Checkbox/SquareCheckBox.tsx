import {
  SquareCheckBoxStyle,
  SquareCheckBoxProps,
} from "./SquareCheckBox.styled";

export const SquareCheckBox = ({
  children,
  ...props
}: SquareCheckBoxProps): JSX.Element => {
  return (
    <>
      <SquareCheckBoxStyle {...props}>{children}</SquareCheckBoxStyle>
    </>
  );
};
