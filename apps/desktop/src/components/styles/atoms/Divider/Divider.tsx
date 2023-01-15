import { DividerStyle, DividerProps } from "./Divider.styled";

export const Divider = ({ ...props }: DividerProps) => {
  return (
    <>
      <DividerStyle {...props}> </DividerStyle>
    </>
  );
};
