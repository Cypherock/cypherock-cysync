import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Typography,
  Container,
  Flex,
  Bullet,
} from "@components";
import { Aside } from "../Aside";

export const SingleCardTap = () => {
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading" mb="mbTwo">
              Tap any X1 Card below the X1 Vault to test card tapping
            </Typography>
            <Typography variant="h6" color="textMuted" mb="mbFive">
              Your X1 card communicates with the X1 Vault through encrypted NFC.
              Make sure you keep it tapped until you hear a beep sound
            </Typography>

            <Container bgColor="list" border rounded="roundedOne">
              <Flex align="center" justify="between" width="wFull">
                <Typography variant="h6" mb="mb0" color="textMuted">
                  X1 Card
                </Typography>
                <Bullet size="lg" variant="gold" />
              </Flex>
            </Container>
          </DialogueBoxBody>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
