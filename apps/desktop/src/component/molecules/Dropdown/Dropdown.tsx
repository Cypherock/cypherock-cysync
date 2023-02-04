import { DropDownSelectStyle, DropDownSelectProps } from "./Dropdown.styled";

export const DropdownSelect = ({
  children,
  ...props
}: DropDownSelectProps): JSX.Element => (
  <>
    <DropDownSelectStyle {...props}>{children}</DropDownSelectStyle>
  </>
);
