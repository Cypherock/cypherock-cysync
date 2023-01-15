import { ReactNode } from "react";
import {
  HeadingOneStyle,
  HeadingProps,
  HeadingFiveStyle,
  HeadingSixStyle,
  HeadingSmallestStyle,
  SpanStyle,
  HeadingFourStyle,
} from "./Heading.styled";

export const HeadingOne = ({ children, ...props }: HeadingProps) => {
  return (
    <>
      <HeadingOneStyle {...props}>{children}</HeadingOneStyle>
    </>
  );
};

export const HeadingSix = ({ children, ...props }: HeadingProps) => {
  return (
    <>
      <HeadingSixStyle {...props}>{children}</HeadingSixStyle>
    </>
  );
};

export const HeadingFive = ({ children, ...props }: HeadingProps) => {
  return (
    <>
      <HeadingFiveStyle {...props}>{children}</HeadingFiveStyle>
    </>
  );
};

export const HeadingFour = ({ children, ...props }: HeadingProps) => {
  return (
    <>
      <HeadingFourStyle {...props}>{children}</HeadingFourStyle>
    </>
  );
};

export const HeadingSmallest = ({ children, ...props }: HeadingProps) => {
  return (
    <>
      <HeadingSmallestStyle {...props}>{children}</HeadingSmallestStyle>
    </>
  );
};

export const Span = ({ children, ...props }: HeadingProps) => {
  return (
    <>
      <SpanStyle {...props}>{children}</SpanStyle>
    </>
  );
};
