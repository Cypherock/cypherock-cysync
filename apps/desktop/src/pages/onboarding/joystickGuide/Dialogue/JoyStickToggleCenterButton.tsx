import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Flex,
  Container,
} from "@components";
import centerButtonSuccess from "@/assets/images/onboarding/joystick/centerButtonSuccess.png";
import { Aside } from "../Aside/Aside";

export const JoyStickToggleCenterButton = () => {
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Typography variant="h4" color="textHeading" mb="mbSeven">
              Center click the joystick to proceed
            </Typography>

            <Image src={centerButtonSuccess} mb="mbSeven" />

            <Typography variant="h5" color="textHeading" mb="mbOne">
              X1 Vault has a center button to perform click
            </Typography>

            <Typography variant="h6" color="textMuted">
              Follow the instruction on the device
            </Typography>
          </DialogueBoxBody>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
