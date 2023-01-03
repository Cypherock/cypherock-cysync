import { Container } from "../../Container.styled";
import { MainContainerContent } from "./OnboardingLayout";
import { Aside } from "../aside/Aside";
// import { DialogueInformation } from "../../../../Onboarding/Popups/DialogueInformation";
// import { DialogueWelcome } from "../../../../Onboarding/Popups/DialogueWelcome";
// import { DialogueEmailConfirmation } from "../../../../Onboarding/Popups/DialogueEmailConfirmation";
import { DialogueTerms } from "../../../../Onboarding/Popups/DialogueTerms";
export const Onboarding = () => {
  return (
    <>
      <MainContainerContent>
        <Aside />
        <Container>
          {/* <DialogueEmailConfirmation /> */}
          {/* <DialogueInformation /> */}
          {/* <DialogueWelcome /> */}
          <DialogueTerms />
        </Container>
      </MainContainerContent>
    </>
  );
};
