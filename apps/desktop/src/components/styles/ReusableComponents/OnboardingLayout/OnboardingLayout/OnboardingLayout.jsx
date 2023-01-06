import { Container } from "../../../atoms/Container/Container.styled";
import { MainContainerContent } from "./OnboardingLayout";
import { Aside } from "../aside/Aside";
import { DialogueWelcome } from "../../../../Onboarding/GetStarted/DialogueWelcome";
import { DialogueTerms } from "../../../../Onboarding/GetStarted/DialogueTerms";
import { DialogueEmailConfirmation } from "../../../../Onboarding/SetPassword/DialogueEmailConfirmation";
import { DialogueLogin } from "../../../../Onboarding/SetPassword/DialogueLogin";
import { DialoguePasswordSetSuccess } from "../../../../Onboarding/SetPassword/DialoguePasswordSetSuccess";
import { DialogueResetPassword } from "../../../../Onboarding/SetPassword/DialogueResetPassword";
import { DialogueSetPassword } from "../../../../Onboarding/SetPassword/DialogueSetPassword";
// import { DeviceAuthTest } from "../../../../Onboarding/DeviceAuthentication/DeviceAuthTest";
import { DeviceAuthTestSuccess } from "../../../../Onboarding/DeviceAuthentication/DeviceAuthTestSucces";
import {
  DeviceAuthTestFailedServerError,
  DeviceAuthTestFailedFrameWareError,
  DeviceAuthTestFailedServerDown,
  DeviceAuthTestFailedDeviceMisconfigured,
} from "../../../../Onboarding/DeviceAuthentication/DeviceAuthTestFailed";
export const Onboarding = () => {
  return (
    <>
      <MainContainerContent>
        <Aside />
        <Container>
          {/* <DialogueWelcome /> */}
          {/* <DialogueTerms /> */}
          {/* <DialogueEmailConfirmation /> */}
          {/* <DialogueLogin /> */}
          {/* <DialoguePasswordSetSuccess /> */}
          {/* <DialogueResetPassword /> */}
          {/* <DialogueSetPassword /> */}
          {/* <DeviceAuthTest /> */}
          {/* <DeviceAuthTestSuccess /> */}
          {/* <DeviceAuthTestFailedServerError /> */}
          {/* <DeviceAuthTestFailedFrameWareError /> */}
          {/* <DeviceAuthTestFailedServerDown /> */}
          <DeviceAuthTestFailedDeviceMisconfigured />
        </Container>
      </MainContainerContent>
    </>
  );
};
