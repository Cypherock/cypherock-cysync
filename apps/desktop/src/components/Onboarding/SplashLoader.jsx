import { Container } from "../styles/Container.styled";
import { SplashLoaderContent } from "../styles/Onboarding/SplashLoaderContent.styled";

export const SplashLoader = () => {
  return (
    <>
      <Container bg="SplashLoader">
        <SplashLoaderContent>
          <div className="splash-loader__img-container">
            <img src="" alt="" className="splash-loader__img" />
          </div>
          <h1 className="splash-loader__heading">cySync App</h1>
          <h3 className="splash-loader__silver-text">Welcome to Cypherock</h3>
          <h5 className="splash-loader__muted-text">
            Your Gateway to Self-Sovereignty
          </h5>
          <h5 className="splash-loader__muted-small-text">ver 2. 314. 3094</h5>
        </SplashLoaderContent>
      </Container>
    </>
  );
};
