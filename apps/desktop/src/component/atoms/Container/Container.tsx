import {
  ContainerStyle,
  DefaultContainerStyle,
  ContainerProps,
  AsideContainerStyle,
  MainContainerStyle,
} from "./Container.styled";

export const Container = ({ children, variant, ...props }: ContainerProps) => {
  {
    switch (variant) {
      case "container":
        return <ContainerStyle {...props}>{children}</ContainerStyle>;
      case "asideContainer":
        return <AsideContainerStyle {...props}>{children}</AsideContainerStyle>;
      case "mainContainer":
        return <MainContainerStyle {...props}>{children}</MainContainerStyle>;
      default:
        return (
          <DefaultContainerStyle {...props}>{children}</DefaultContainerStyle>
        );
    }
  }
};
