import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Flex,
  Container,
} from "@components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import success from "@assets/images/onboarding/setPass/success.png";
import { Aside } from "../Aside";
import { Link } from "react-router-dom";
import back from "@assets/images/back.png";
import { ONBOARDING_ROUTE_SET_PASSWORD } from "../../../../routes/constantRoutePath";

export const PasswordSetSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/setPasswordLogin');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Flex gap="gap0">
      <Aside screenName="Set Password"/>
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={success} mb="mbFour" />
            <Typography variant="h5" color="textHeading" mb="mbTwo">
              Your new password is set
            </Typography>
            <Typography variant="h6" color="textMuted">
              Please wait while take you to the login screen
            </Typography>
          </DialogueBoxBody>
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
