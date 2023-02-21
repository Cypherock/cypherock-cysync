import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  Typography,
  Container,
  Flex,
  Image,
} from "@components";
import { Link } from "react-router-dom";
import { Aside } from "./Aside";

export const Information = (): JSX.Element => {
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer lg>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading" mb="mbSix">
              Ensure the following before you continue
            </Typography>

            <Container bgColor="list" column>
              <Flex alignCenter mb="mbTwo" gapTwo>
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  You are present in a safe and secure environment
                </Typography>
              </Flex>
              <Flex alignCenter mb="mbTwo" gapTwo>
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  You have atleast 15-30 minutes to setup your wallet
                </Typography>
              </Flex>
              <Flex alignCenter mb="mbTwo" gapTwo>
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  You have an active internet connection
                </Typography>
              </Flex>
              <Flex alignCenter mb="mbTwo" gapTwo>
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  The tamper-proof seal of the package is intact
                </Typography>
              </Flex>
              <Flex alignCenter mb="mbTwo" gapTwo>
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  Cypherock will never ask you for your seed phrase nor will it
                  ever ask you to sign a transaction
                </Typography>
              </Flex>
              <Flex alignCenter mb="mbTwo" gapTwo>
                <Bullet size="sm" />
                <Typography variant="h5" color="textMuted" textAlign="left">
                  Cypherock will only email you from cypherock.com. Do not trust
                  any email from any other website domain
                </Typography>
              </Flex>
            </Container>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to="/welcome">
              <Button variation="primary">Continue</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
