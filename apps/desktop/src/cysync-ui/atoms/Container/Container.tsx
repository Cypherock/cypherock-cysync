import { ReactNode } from "react";
import {
  ContainerStyle,
  DefaultContainerStyle,
  ContainerProps,
  AsideContainerStyle,
  MainContainerStyle,
  ListContainerStyle,
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

export const AsideContainer = ({ children, ...props }: ContainerProps) => {
  return (
    <>
      <AsideContainerStyle {...props}>{children}</AsideContainerStyle>
    </>
  );
};
export const MainContainer = ({ children, ...props }: ContainerProps) => {
  return (
    <>
      <MainContainerStyle {...props}>{children}</MainContainerStyle>
    </>
  );
};
