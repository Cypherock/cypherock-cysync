import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Flex,
  Container,
} from "@components";
import success from "@/assets/images/onboarding/setPass/success.png";
import { Aside } from "../Aside/Aside";

export const JoyStickToggleSuccess = () => {
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={success} mb="mbThree" />
            <Typography variant="h5" color="textHeading">
              Joystick test complete
            </Typography>
            <Typography variant="h6" color="textMuted" mt="mtOne">
              Please wait while take you to the next screen
            </Typography>
          </DialogueBoxBody>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
