import { Container } from "../styles/atoms/Container/Container.styled";
import { AsideContent } from "../styles/Onboarding/AsideContent.styled";
import cySync from "./logo-small.png";

export const SplashLoader = () => {
  return (
    <>
      <Container bg="SplashLoader">
        <AsideContent content="welcomeAside">
          <div className="aside-logo">
            <img src={cySync} alt="" />
          </div>
          <div className="splash-loader__img-container">
            <img src={cySync} alt="" className="splash-loader__img" />
          </div>
          <h1 className="splash-loader__heading">cySync App</h1>
          <h3 className="splash-loader__silver-text">Welcome to Cypherock</h3>
          <h5 className="splash-loader__muted-text">
            Your Gateway to Self-Sovereignty
          </h5>
          <h5 className="splash-loader__muted-small-text">ver 2. 314. 3094</h5>
          <h5 className="splash-loader__muted-small-text-test">
            ver 2. 314. 3094
          </h5>
        </AsideContent>
      </Container>
    </>
  );
};
