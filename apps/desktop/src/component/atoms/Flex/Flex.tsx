import { FlexStyle } from "./Flex.styled";

export const Flex = ({ children, ...props }) => {
  return (
      <FlexStyle {...props}>{children}</FlexStyle>
  );
};
