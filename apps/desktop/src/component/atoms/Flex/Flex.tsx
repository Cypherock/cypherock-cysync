import { FlexStyle, FlexProps } from "./Flex.styled";

export const Flex = ({ children, ...props }: FlexProps) => {
  return (
    <>
      <FlexStyle {...props}>{children}</FlexStyle>
    </>
  );
};
