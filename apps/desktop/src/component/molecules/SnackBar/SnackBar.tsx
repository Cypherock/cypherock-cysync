import {
  SnackBarBtnStyle,
  SnackBarItemStyle,
  SnackBarStyle,
  SnackBarProps,
} from "./SnackBar.styled";

export const SnackBar = ({ children, ...props }: SnackBarProps) => {
  return (
    <>
      <SnackBarStyle {...props}>{children}</SnackBarStyle>
    </>
  );
};

export const SnackBarItem = ({ children, ...props }: SnackBarProps) => {
  return (
    <>
      <SnackBarItemStyle {...props}>{children}</SnackBarItemStyle>
    </>
  );
};

export const SnackBarBtn = ({ children, ...props }: SnackBarProps) => {
  return (
    <>
      <SnackBarBtnStyle {...props}>{children}</SnackBarBtnStyle>
    </>
  );
};
