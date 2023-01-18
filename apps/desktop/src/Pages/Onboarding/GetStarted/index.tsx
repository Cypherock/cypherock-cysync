import { Aside } from "./Aside/Aside.jsx";
import { DialogueInfo, DialogueTerms, DialogueWelcome } from "./Dialogues/";
import { Flex, Container } from "@/cysync-ui";
import {
  DeviceAuthTestFailedServerError,
  DeviceAuthTestFailedDeviceMisconfigured,
  DeviceAuthTestFailedServerDown,
  DeviceAuthTestFailedFrameWareError,
} from "../DeviceAuthentication/Dialogue/DeviceAuthTestFailed.js";
import { DeviceAuthText } from "../DeviceAuthentication/Dialogue/DeviceAuthTest.js";
import { JoyStickToggle } from "../JoystickGuide/Dialogue/JoystickToggle.js";
import { JoyStickToggleCenterButton } from "../JoystickGuide/Dialogue/JoyStickToggleCenterButton.js";
import { SingleTap } from "../CardAuth/Dialogue/SingleTap.js";
import { CardPairing } from "../CardAuth/Dialogue/CardPairing.js";

export const GetStarted = (): JSX.Element => {
  return (
    <>
      <Flex alignCenter contentGratient>
        <Aside />
        <Container>
          {/* <DeviceAuthTestFailedServerError /> */}
          {/* <DeviceAuthTestFailedDeviceMisconfigured /> */}
          {/* <DeviceAuthTestFailedServerDown /> */}
          {/* <CardPairing /> */}
          {/* <DialogueInfo /> */}
        </Container>
      </Flex>
    </>
  );
};
