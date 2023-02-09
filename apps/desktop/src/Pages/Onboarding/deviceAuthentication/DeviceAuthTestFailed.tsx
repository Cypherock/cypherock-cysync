import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  DialogueBoxFooter,
  Button,
  Typography,
  Flex,
  Container,
} from "@/component";
import serverError from "@/assets/images/onboarding/deviceAuth/server-off.png";
import failed from "@/assets/images/onboarding/deviceAuth/fail.png";
import setting from "@/assets/images/onboarding/deviceAuth/settings-wrong.png";
import { Aside } from "./Aside";

export const DeviceAuthTestFailedServerError = () => {
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={serverError} mb="mbFive" />
            <Typography variant="h5" color="textHeading">
              Device Authentication has failed
            </Typography>

            <Typography variant="h5" color="textMuted">
              Server data missing: There seems to be a server error. Retry by
              reconnecting the device first
            </Typography>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            <Button variation="secondary" disabled={true}>
              Contact
            </Button>
            <Button variation="primary">Retry</Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};

export const DeviceAuthTestFailedFrameWareError = () => {
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={failed} mb="mbFive" />
            <Typography variant="h5" color="textHeading">
              Device Authentication has failed
            </Typography>

            <Typography variant="h5" color="textMuted">
              There seems to be error with the ATECC firmware. Contact Cypherock
              support immmediately
            </Typography>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            <Button variation="primary">Contact Support</Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};

export const DeviceAuthTestFailedServerDown = () => {
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={failed} mb="mbFive" />
            <Typography variant="h5" color="textHeading">
              Device Authentication has failed
            </Typography>
            <Typography variant="h6" color="textMuted">
              The server seems to be down try connecting again after some time
            </Typography>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            <Button variation="primary">Retry</Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};

export const DeviceAuthTestFailedDeviceMisconfigured = () => {
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={setting} mb="mbFive" />

            <Typography variant="h5" color="textHeading">
              Device Authentication has failed
            </Typography>
            <Typography variant="h6" color="textMuted">
              Device seems to be misconfigured. Contact Cypherock support
              immediately
            </Typography>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            <Button variation="primary">Contact Support</Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
