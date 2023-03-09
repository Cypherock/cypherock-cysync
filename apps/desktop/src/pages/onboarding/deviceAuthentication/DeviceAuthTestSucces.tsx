import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Container,
  Flex,
} from "@components";
import success from "@/assets/images/onboarding/setPass/success.png";
import { Aside } from "./Aside";

export const DeviceAuthTestSuccess = () => {
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={success} mb="mbFour" />
            <Typography variant="h5" color="textHeading" mb="mbOne">
              Your X1 Vault is successfully authenticated
            </Typography>
            <Typography color="textMuted">
              Please wait while take you to the next screen
            </Typography>
          </DialogueBoxBody>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
