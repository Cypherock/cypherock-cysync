import {
  ContainerStyle,
  DefaultContainerStyle,
  ContainerProps,
  AsideContainerStyle,
  MainContainerStyle,
  ModalContainerStyle
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
      case "modalContainer":
        return <ModalContainerStyle {...props}>{children}</ModalContainerStyle>
      default:
        return (
          <DefaultContainerStyle {...props}>{children}</DefaultContainerStyle>
        );
    }
  }
};
