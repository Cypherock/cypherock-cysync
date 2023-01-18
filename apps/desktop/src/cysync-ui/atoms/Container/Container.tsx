import { ReactNode } from "react";
import {
  ContainerStyle,
  DefaultContainerStyle,
  ContainerProps,
} from "./Container.styled";

export const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <>
      <ContainerStyle {...props}>{children}</ContainerStyle>
    </>
  );
};

export const DefaultContainer = ({ children, ...props }: ContainerProps) => {
  return (
    <>
      <DefaultContainerStyle {...props}>{children}</DefaultContainerStyle>
    </>
  );
};
