import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  Container,
  Flex,
  Typography,
} from "@components";
import { Link } from "react-router-dom";
import { Aside } from "./Aside";
import { ONBOARDING_ROUTE_USAGE } from "../../../routes/constantRoutePath";

export const Welcome = (): JSX.Element => {
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <Flex position="absolute" top="topThree" right="rightThree">
          <Typography color="textMuted">Help</Typography>
          <Typography color="textGold">?</Typography>
        </Flex>
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading" mb="mbOne">
              Ensure the product contains the following
            </Typography>
            
            <Typography variant="h6" color="textMuted" mb="mbSix">
              Make sure the tamper-proof seal of the package was intact
            </Typography>
            <Container rounded="roundedOne" bgColor="list" mb="mbSix">
              <Flex justify="between" width="wFull">
                <Flex direction="column">
                  <Flex align="center" gap="gapTwo" mb="mbTwo">
                    <Bullet variant="gold" size="sm" />

                    <Typography variant="h6" color="textGold">
                      X1 Vault
                    </Typography>
                  </Flex>

                  <Flex align="center" gap="gapTwo">
                    <Bullet size="sm" />

                    <Typography variant="h6" color="textMuted">
                      4 X1 Cards
                    </Typography>
                  </Flex>
                </Flex>

                <Flex direction="column">
                  <Flex align="center" gap="gapTwo" mb="mbTwo">
                    <Bullet size="sm" />

                    <Typography variant="h6" color="textMuted">
                      4 Card Covers
                    </Typography>
                  </Flex>

                  <Flex align="center" gap="gapTwo">
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
                  Please email at <Typography variant="h6" color="textHeading" display="inline"> support@cypherock.com </Typography> if your package does not
                  contain any of these
                </Typography>
              </Flex>
            </Container>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to={ONBOARDING_ROUTE_USAGE}>
              <Button variation="primary">Get Started</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
