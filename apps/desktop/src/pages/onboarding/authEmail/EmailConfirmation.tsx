import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  InputContainer,
  Input,
  InputLabel,
  Divider,
  Button,
  Typography,
  Flex,
  Container,
  Image,
} from "@components";
import passwordHide from "@assets/images/onboarding/setPass/password-hide.png";
import back from "@assets/images/back.png";
import { Link } from "react-router-dom";
import { Aside } from "./Aside";
import { ONBOARDING_ROUTE_DEVICE_AUTH_TEST,ONBOARDING_ROUTE_SET_PASSWORD } from "../../../routes/constantRoutePath";

export const EmailConfirmation = (): JSX.Element => {
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
              You are recommended to enter an email ID as a 2FA to get
              authenticity results
            </Typography>
            <Typography variant="h6" color="textMuted" mb="mbFive">
              We do not store this email ID permanently on servers 
              (<Typography color="textGold" display="inline" variant="h6">?</Typography>)
            </Typography>

            <InputContainer>
              <InputLabel>Your Email</InputLabel>
              <Input type="text" placeholder="**************" />
              <img src={passwordHide} alt="" />
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
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to={ONBOARDING_ROUTE_DEVICE_AUTH_TEST}>
              <Button variation="secondary">Skip</Button>
            </Link>
            <Link to={ONBOARDING_ROUTE_DEVICE_AUTH_TEST}>
              <Button variation="primary">Continue</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>

        <Link to={ONBOARDING_ROUTE_SET_PASSWORD}>
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
