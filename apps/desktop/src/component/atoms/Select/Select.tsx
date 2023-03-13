import {
    SelectContainerStyle,
    SelectProps,
} from "./Select.styled";
  
export const SelectContainer = ({ children }: SelectProps) => {
    return (
        <SelectContainerStyle>{children}</SelectContainerStyle>
    );
};
  
  
  