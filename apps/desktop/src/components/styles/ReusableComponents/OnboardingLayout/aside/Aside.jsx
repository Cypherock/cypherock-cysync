import { Container } from "../../Container.styled";
import { AsideContainer } from "./Aside.styled";
import { SplashLoader } from "../../../../Onboarding/SplashLoader";

export const Aside = () => {
  return (
    <>
      <AsideContainer>
        <Container bg="SplashLoader">
          <SplashLoader content="welcomeAside"></SplashLoader>
        </Container>
      </AsideContainer>
    </>
  );
};
