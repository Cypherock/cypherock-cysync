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
} from "@components";
import { Link } from "react-router-dom";
import { Aside } from "./Aside";

export const Welcome = (): JSX.Element => {
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <Flex position="absolute" top="topThree" right="rightThree">
          <Typography color="textMuted">Help</Typography>
          <Typography color="textGold">?</Typography>
        </Flex>
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading">
              Ensure the product contains the following
            </Typography>
            <Typography variant="h6" color="textMuted" mb="mbSix">
              Make sure the tamper-proof seal of the package was intact
            </Typography>
            <Container rounded="roundedOne" bgColor="list" mb="mbSix">
              <Flex justifyBetween width="wFull">
                <Flex column>
                  <Flex alignCenter gapTwo>
                    <Bullet variant="gold" size="sm" />

                    <Typography variant="h6" color="textGold">
                      X1 Vault
                    </Typography>
                  </Flex>

                  <Flex alignCenter gapTwo>
                    <Bullet size="sm" />

                    <Typography variant="h6" color="textMuted">
                      4 X1 Cards
                    </Typography>
                  </Flex>
                </Flex>

                <Flex column>
                  <Flex alignCenter gapTwo>
                    <Bullet size="sm" />

                    <Typography variant="h6" color="textMuted">
                      4 Card Covers
                    </Typography>
                  </Flex>

                  <Flex alignCenter gapTwo>
                    <Bullet size="sm" />

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
            <Link to="/usage">
              <Button variation="primary">Get Started</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
