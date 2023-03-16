import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Input,
  InputContainer,
  InputLabel,
  Divider,
  Button,
  Typography,
  Flex,
  Container,
  Image,
  InputPassword
} from "@components";
import passwordHide from "@assets/images/onboarding/setPass/password-hide.png";
import back from "@assets/images/back.png";
import { Link } from "react-router-dom";
import { Aside } from "../Aside";
import { useCallback } from "react";

export const SetPassword = () => {

  const confirmPasswordOnClick = () => {
    console.log("confirm password");
  };  
  
  return (
    <Flex gap="gap0">
      <Aside screenName="Set Password"/>
      <Container variant="container" bgColor="contentGratient">
        <Flex position="absolute" top="topThree" right="rightThree">
          <Typography color="textMuted">Help</Typography>
          <Typography color="textGold">?</Typography>
        </Flex>
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading" mb="mbTwo">
              Set your cySync password (<Typography color="textGold" display="inline" variant="h5">?</Typography>)
            </Typography>
            <Typography variant="h6" color="textMuted" mb="mbFive">
              We do not store your password on our servers.
            </Typography>

            <InputContainer>
              <InputLabel>New Password</InputLabel>
              <InputPassword type="password" placeholder="**************" />
            </InputContainer>

            <InputContainer>
              <InputLabel>Confirm Password</InputLabel>
              <InputPassword type="password" placeholder="**************" />
            </InputContainer>
            <Divider mb="mbThree" />

            <Typography
              variant="h6"
              color="textError"
              mb="mbEight"
              textAlign="left"
            >
              Password mismatch and other error messages
            </Typography>
            <Typography variant="h6" color="textMuted" mb="mbTwo">
              Use 8 or more charecters with a mix of letters, numberts & symbols
            </Typography>

            <Divider />
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to="/email2fa">
              <Button variation="secondary">Skip</Button>
            </Link>
            <Link to="/setPasswordSucess">
              <Button onClick={confirmPasswordOnClick} variation="primary">Confirm</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>

        <Link to="/termsOfUse">
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
