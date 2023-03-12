import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  Container,
  Flex,
  CheckBox,
  Typography,
  Image,
} from "@components";
import linkImage from "@assets/images/onboarding/getStarted/terms-link.png";
import back from "@assets/images/back.png";
import { Link } from "react-router-dom";
import { Aside } from "./Aside";

export const Terms = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);
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
            <Typography variant="h5" color="textHeading" mb="mbTwo">
              Terms of use
            </Typography>
            <Typography variant="h6" color="textMuted" mb="mbSix">
              Please take some time to review our Terms of Service and Privacy
              Policy
            </Typography>

            <Container mb="mbTwo" rounded="roundedOne" bgColor="list" border>
              <Flex justify="between" width="wFull">
                <Flex align="center" gap="gapTwo">
                  <Bullet size="sm" />
                  <Typography variant="h6" color="textHeading">
                    Terms of Service
                  </Typography>
                </Flex>
                <a href="">
                  <img src={linkImage}></img>
                </a>
              </Flex>
            </Container>

            <Container mb="mbThree" rounded="roundedOne" bgColor="list" border>
              <Flex justify="between" width="wFull">
                <Flex align="center" gap="gapTwo">
                  <Bullet size="sm" />

                  <Typography variant="h6" color="textHeading">
                    Privacy Policy
                  </Typography>
                </Flex>
                <a href="">
                  <img src={linkImage}></img>
                </a>
              </Flex>
            </Container>

            <Flex align="center">
              <CheckBox variation="squareCheckBox">
                <div>
                  <input
                    type="checkbox"
                    onClick={() => setIsChecked((wasCheched) => !wasCheched)}
                  />
                </div>
              </CheckBox>
              <Typography color="textMuted" textAlign="left" ml="mlTwo">
                I have read and agree with the Terms of Use and Privacy Policy
              </Typography>
            </Flex>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            {isChecked ? (
              <Link to="/setPassword">
                <Button variation="primary">Confirm</Button>
              </Link>
            ) : (
              <Button variation="secondary" disabled={true}>
                Confirm
              </Button>
            )}
          </DialogueBoxFooter>
        </DialogueBoxContainer>

        <Link to="/welcome">
          <Flex
            position="absolute"
            bottom="bottomThree"
            left="backBottom"
            gap="gapOne"
            align="center"
          >
            <Image src={back} />
            <Typography color="textMuted">Back</Typography>
          </Flex>
        </Link>
      </Container>
    </Flex>
  );
};
