import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  Container,
  Flex,
  Span,
  Typography,
} from "@/component";

export const Welcome = (): JSX.Element => {
  return (
    <DialogueBoxContainer md>
      <DialogueBoxBody>
        <Typography variant="h6" color="textHeading">
          Ensure the product contains the following
        </Typography>
        <Typography variant="h6" color="textHeading" mb="mbSix">
          Make sure the tamper-proof seal of the package was intact
        </Typography>
        <Container rounded="roundedOne" bgColor="list" mb="mbSix">
          <Flex justifyBetween>
            <Flex column>
              <Flex alignCenter>
                <Bullet variant="gold" />

                <Typography variant="h6" color="textGold">
                  X1 Vault
                </Typography>
              </Flex>

              <Flex alignCenter>
                <Bullet />

                <Typography variant="h6" color="textMuted">
                  4 X1 Cards
                </Typography>
              </Flex>
            </Flex>

            <Flex column>
              <Flex alignCenter>
                <Bullet />

                <Typography variant="h6" color="textMuted">
                  4 Card Covers
                </Typography>
              </Flex>

              <Flex alignCenter>
                <Bullet />
                <Typography variant="h6" color="textMuted">
                  USB Cable
                </Typography>
              </Flex>
            </Flex>
          </Flex>
        </Container>

        <Container rounded="roundedOne" bgColor="list" border>
          <Flex>
            <Typography variant="h6" color="textMuted">
              Please email at support@cypherock.com if your package does not
              contain any of these
            </Typography>
          </Flex>
        </Container>
      </DialogueBoxBody>
      <DialogueBoxFooter>
        <Button variation="primary">Get Started</Button>
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
