import { ChipStyle, ClipProps } from "./Chip.styled";

export const Chip = ({ children, ...props }: ClipProps): JSX.Element => (
  <>
    <ChipStyle {...props}>{children}</ChipStyle>
  </>
);
