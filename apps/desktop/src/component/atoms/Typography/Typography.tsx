import {
  HeadingOneStyle,
  HeadingTwoStyle,
  HeadingThreeStyle,
  HeadingFourStyle,
  HeadingFiveStyle,
  HeadingSmallestStyle,
  HeadingSixStyle,
  HeadingProps,
} from "./Typography.style";
import { ReactNode } from "react";

type TypographyProps = {
  src?: any;
  children?: ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
} & HeadingProps;

export const Typography = ({
  variant,
  children,
  ...props
}: TypographyProps) => {
  switch (variant) {
    case "h1":
      return <HeadingOneStyle {...props}>{children}</HeadingOneStyle>;
    case "h2":
      return <HeadingTwoStyle {...props}>{children}</HeadingTwoStyle>;
    case "h3":
      return <HeadingThreeStyle {...props}>{children}</HeadingThreeStyle>;
    case "h4":
      return <HeadingFourStyle {...props}>{children}</HeadingFourStyle>;
    case "h5":
      return <HeadingFiveStyle {...props}>{children}</HeadingFiveStyle>;
    case "h6":
      return <HeadingSixStyle {...props}>{children}</HeadingSixStyle>;
    default:
      return <HeadingSmallestStyle {...props}>{children}</HeadingSmallestStyle>;
  }
};
