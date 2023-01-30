import { ChipStyle, ClipProps } from "./Chip.style";

export const Chip = ({ children, ...props }: ClipProps): JSX.Element => (
  <>
    <ChipStyle {...props}>{children}</ChipStyle>
  </>
);
