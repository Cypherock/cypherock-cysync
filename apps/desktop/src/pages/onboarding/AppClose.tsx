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


export const AppClose = () => {
  return (
    <Container position="absolute" variant="modalContainer" justify="center" align="center">
      <Flex>
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
      </Flex>
    </Container>
  );
};
