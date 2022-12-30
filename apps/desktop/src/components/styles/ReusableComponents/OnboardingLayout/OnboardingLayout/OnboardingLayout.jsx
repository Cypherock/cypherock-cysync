import { Container } from "../../Container.styled";
import { MainContainerContent } from "./OnboardingLayout";
import { Aside } from "../aside/Aside";
import { PopupTerms } from "../../../../Onboarding/Popups/PopupTerms";

export const Onboarding = () => {
  return (
    <>
      <MainContainerContent>
        <Aside />
        <Container>
          <PopupTerms />
        </Container>
      </MainContainerContent>
    </>
  );
};
