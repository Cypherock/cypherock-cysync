import { Container } from "../../../atoms/Container/Container.styled";
import { MainContainerContent } from "./OnboardingLayout";
import { Aside } from "../aside/Aside";
import { DialogueWelcome } from "../../../../Onboarding/GetStarted/DialogueWelcome";
import { DialogueTerms } from "../../../../Onboarding/GetStarted/DialogueTerms";
export const Onboarding = () => {
  return (
    <>
      <MainContainerContent>
        <Aside />
        <Container>
          {/* <DialogueWelcome /> */}
          <DialogueTerms />
        </Container>
      </MainContainerContent>
    </>
  );
};
