import { DropDownSelectStyle, DropDownSelectProps } from "./Dropdown.style";

export const DropdownSelect = ({
  children,
  ...props
}: DropDownSelectProps): JSX.Element => (
  <>
    <DropDownSelectStyle {...props}>{children}</DropDownSelectStyle>
  </>
);
