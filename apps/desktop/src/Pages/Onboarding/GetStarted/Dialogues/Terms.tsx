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
} from "@/component";
import linkImage from "@/assets/images/onboarding/getStarted/terms-link.png";

export const Terms = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <DialogueBoxContainer md>
      <DialogueBoxBody>
        <Typography variant="h5" color="textHeading">
          Terms of use
        </Typography>
        <Typography variant="h6" color="textHeading" mb="mbSix">
          Please take some time to review our Terms or Service and Privacy
          Policy
        </Typography>

        <Container mb="mbTwo" rounded="roundedOne" bgColor="list" border>
          <Flex justifyBetween>
            <Flex alignCenter gapTwo>
              <Bullet></Bullet>
              <Typography variant="h6" color="textHeading" mb="mbSix">
                Terms of Service
              </Typography>
            </Flex>
            <a href="">
              <img src={linkImage}></img>
            </a>
          </Flex>
        </Container>

        <Container mb="mbThree" rounded="roundedOne" bgColor="list" border>
          <Flex justifyBetween>
            <Flex alignCenter gapTwo>
              <Bullet></Bullet>

              <Typography variant="h6" color="textHeading" mb="mbSix">
                Privacy Policy
              </Typography>
            </Flex>
            <a href="">
              <img src={linkImage}></img>
            </a>
          </Flex>
        </Container>

        <Flex alignCenter>
          <CheckBox variation="squareCheckBox">
            <div>
              <input
                type="checkbox"
                onClick={() => setIsChecked((wasCheched) => !wasCheched)}
              />
            </div>
          </CheckBox>
          <Typography color="textMuted" textAlign="left">
            I have read and agree with the Terms of Use and Privacy Policy
          </Typography>
        </Flex>
      </DialogueBoxBody>

      <DialogueBoxFooter>
        {isChecked ? (
          <Button variation="primary">Confirm</Button>
        ) : (
          <Button variation="secondary" disabled={true}>
            Confirm
          </Button>
        )}
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
