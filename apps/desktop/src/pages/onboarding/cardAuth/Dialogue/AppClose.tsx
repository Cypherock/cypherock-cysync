import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxTopBar,
  Image,
  Typography,
  Flex,
  Container
} from "@components";
import loader from "@assets/images/onboarding/deviceAuth/loader.png";
import { Aside } from "../Aside";

export const AppClose = () => {
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxTopBar>
            <Typography variant="h6" color="textMuted">
              Exiting
            </Typography>
          </DialogueBoxTopBar>
          <DialogueBoxBody>
            <Image src={loader} mb="mbThree" />
            <Typography variant="h5" color="textHeading">
              Thanks for contacting us. We will soon get in touch with you to assist
              you
            </Typography>
            <Typography variant="h6" color="textMuted" mt="mtTwo">
              Please wait while we exit the app...
            </Typography>
          </DialogueBoxBody>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
