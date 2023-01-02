import { Container } from "../../Container.styled";
import { MainContainerContent } from "./OnboardingLayout";
import { Aside } from "../aside/Aside";
import { DialogueInformation } from "../../../../Onboarding/Popups/DialogueInformation";
// import { DialogueEmailConfirmation } from "../../../../Onboarding/Popups/DialogueEmailConfirmation";

export const Onboarding = () => {
  return (
    <>
      <MainContainerContent>
        <Aside />
        <Container>
          {/* <DialogueEmailConfirmation /> */}
          <DialogueInformation />
        </Container>
      </MainContainerContent>
    </>
  );
};
