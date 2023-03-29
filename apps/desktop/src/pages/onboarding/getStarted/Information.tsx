import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  Typography,
  Container,
  Flex,
} from "@components";
import { Link, useNavigate } from "react-router-dom";
import { Aside } from "./Aside";
import { ONBOARDING_ROUTE_WELCOME } from "../../../routes/constantRoutePath";
import { useCallback } from "react";

// Information page of the onboarding process.
export const Information = ({ onNext}: {
  onNext: () => void;
} ): JSX.Element => {

   let navigate = useNavigate();
  // handler to set the local storage item and navigate to the next page.
  const handleAgreeAndStartOnboarding = useCallback(() => {
    console.log("inside handler")
    // store the confirmation in the local storage.
    localStorage.setItem("agreeAndStartOnboarding", "true");
    // navigate to the next page.
    onNext();

  }, []);

  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer lg>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading" mb="mbSix">
              Ensure the following before you continue
            </Typography>

            <Container bgColor="list" direction="column">
              <Flex align="center" mb="mbTwo" gap="gapTwo">
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  You are present in a safe and secure environment
                </Typography>
              </Flex>
              <Flex align="center" mb="mbTwo" gap="gapTwo">
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  You have atleast 15-30 minutes to setup your wallet
                </Typography>
              </Flex>
              <Flex align="center" mb="mbTwo" gap="gapTwo">
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  You have an active internet connection
                </Typography>
              </Flex>
              <Flex align="center" mb="mbTwo" gap="gapTwo">
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  The tamper-proof seal of the package is intact
                </Typography>
              </Flex>
              <Flex align="center" mb="mbTwo" gap="gapTwo">
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  Cypherock will never ask you for your seed phrase nor will it
                  ever ask you to sign a transaction
                </Typography>
              </Flex>
              <Flex align="center" mb="mbTwo" gap="gapTwo">
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  Cypherock will only email you from cypherock.com. Do not trust
                  any email from any other website domain
                </Typography>
              </Flex>
            </Container>
          </DialogueBoxBody>
          <DialogueBoxFooter>
              <Button onClick={handleAgreeAndStartOnboarding} variation="primary">Continue</Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
