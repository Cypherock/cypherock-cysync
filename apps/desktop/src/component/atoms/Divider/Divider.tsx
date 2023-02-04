import {
  DividerHorizontalStyle,
  DividerVerticalStyle,
  DividerProps,
} from "./Divider.styled";

export const Divider = ({ variant, ...props }: DividerProps) => {
  switch (variant) {
    case "vertical":
      return <DividerHorizontalStyle {...props} />;
    default:
      return <DividerVerticalStyle {...props} />;
  }
};
