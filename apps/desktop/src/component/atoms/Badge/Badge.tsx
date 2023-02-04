import { BadgeStyle, BadgeProps, BadgeTypographyStyle } from "./Badge.styled";

export const Badge = ({ children, ...props }: BadgeProps): JSX.Element => {
  return (
    <>
      <BadgeStyle {...props}>{children}</BadgeStyle>
    </>
  );
};

export const BadgeTypography = ({
  children,
  ...props
}: BadgeProps): JSX.Element => {
  return (
    <>
      <BadgeTypographyStyle {...props}>{children}</BadgeTypographyStyle>
    </>
  );
};
