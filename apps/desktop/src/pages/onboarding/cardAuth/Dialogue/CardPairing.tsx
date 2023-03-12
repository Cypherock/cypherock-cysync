import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Typography,
  Container,
  Flex,
  Bullet,
  Button,
} from "@components";
import { Aside } from "../Aside";

export const CardPairing = () => {
  return (
    <Flex gap="gap0">
      <Aside />
        <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer lg>
          <DialogueBoxBody>
            <Typography variant="h5" mb="mbTwo" color="textHeading">
              Tap X1 cards one by one below the X1 vault
            </Typography>
            <Typography variant="h6" mb="mbSix" color="textMuted">
              Do not lift until you hear 3 beep sounds
            </Typography>

            <Container bgColor="list" rounded="roundedOne" border mb="mbOne">
              <Flex align="center" justify="between" width="wFull">
                <Typography variant="h6" color="textMuted">
                  X1 Card #1
                </Typography>

                <Flex gap="gapTwo">
                  <Bullet size="lg" variant="muted" />
                  <Bullet size="lg" variant="success" />
                  <Bullet size="lg" variant="failed" />
                </Flex>
              </Flex>
            </Container>

            <Container bgColor="list" rounded="roundedOne" border mb="mbOne">
              <Flex align="center" justify="between" width="wFull">
                <Typography variant="h6" color="textMuted">
                  X1 Card #2
                </Typography>

                <Flex gap="gapTwo">
                  <Bullet size="lg" variant="muted" />
                  <Bullet size="lg" variant="success" />
                  <Bullet size="lg" variant="failed" />
                </Flex>
              </Flex>
            </Container>

            <Container bgColor="list" rounded="roundedOne" border mb="mbOne">
              <Flex align="center" justify="between" width="wFull">
                <Typography variant="h6" mb="mb0" color="textMuted">
                  X1 Card #3
                </Typography>

                <Flex gap="gapTwo">
                  <Bullet size="lg" variant="muted" />
                  <Bullet size="lg" variant="success" />
                  <Bullet size="lg" variant="failed" />
                </Flex>
              </Flex>
            </Container>

            <Container bgColor="list" rounded="roundedOne" border mb="mbSix">
              <Flex align="center" justify="between" width="wFull">
                <Typography variant="h6" color="textMuted">
                  X1 Card #4
                </Typography>

                <Flex gap="gapTwo">
                  <Bullet size="lg" variant="muted" />
                  <Bullet size="lg" variant="success" />
                  <Bullet size="lg" variant="failed" />
                </Flex>
              </Flex>
            </Container>
            <Typography variant="h6" color="textError">
              Wrong card! Make sure you use your card should belong to the same
              family
            </Typography>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Button variation="secondary"> Support </Button>
            <Button variation="primary">Retry</Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
