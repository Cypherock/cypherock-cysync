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
} from "@components";
import serverError from "@assets/images/onboarding/deviceAuth/server-off.png";
import failed from "@assets/images/onboarding/deviceAuth/fail.png";
import setting from "@assets/images/onboarding/deviceAuth/settings-wrong.png";
import { Aside } from "./Aside";
import { Link } from "react-router-dom";
import { ONBOARDING_ROUTE_DEVICE_AUTH_TEST } from "../../../routes/constantRoutePath";
import { Support } from "../Support";
import { AppClose } from "../AppClose";

export const DeviceAuthTestFailedServerError = () => {
  const [popupSupport, setPopupSupport] = useState(false);
  const [popupAppClose, setPopupAppClose] = useState(false);
  const clickSupportClose = () => {
    setPopupSupport(false);
  }
  const toggleAppClose = () => {
    setPopupAppClose((popup) => !popup);
  }
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={serverError} mb="mbFour" />
            <Typography variant="h5" color="textHeading" mb="mbOne">
              Device Authentication has failed
            </Typography>

            <Typography variant="h6" color="textMuted">
              Server data missing: There seems to be a server error. Retry by
              reconnecting the device first
            </Typography>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            <Button variation="secondary"
              onClick={() => setPopupSupport((wasOpen) => !wasOpen)}
            >
              Contact
            </Button>
            <Link to={ONBOARDING_ROUTE_DEVICE_AUTH_TEST}>
              <Button variation="primary">Retry</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>

      {popupSupport===true &&  <Support clickSupportClose={clickSupportClose} appCloseOpen={toggleAppClose}/>}
      {popupAppClose===true && <AppClose />}

    </Flex>
  );
};

export const DeviceAuthTestFailedFirmWareError = () => {
  const [popupSupport, setPopupSupport] = useState(false);
  const [popupAppClose, setPopupAppClose] = useState(false);
  const clickSupportClose = () => {
    setPopupSupport(false);
  }
  const toggleAppClose = () => {
    setPopupAppClose((popup) => !popup);
  }
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={failed} mb="mbFour" />
            <Typography variant="h5" color="textHeading" mb="mbOne">
              Device Authentication has failed
            </Typography>

            <Typography variant="h6" color="textMuted">
              There seems to be error with the ATECC firmware. Contact Cypherock
              support immmediately
            </Typography>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            <Button variation="primary"
              onClick={() => setPopupSupport((wasOpen) => !wasOpen)}
            >
              Contact Support
            </Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>

      {popupSupport===true &&  <Support clickSupportClose={clickSupportClose} appCloseOpen={toggleAppClose}/>}
      {popupAppClose===true && <AppClose />}

    </Flex>
  );
};

export const DeviceAuthTestFailedServerDown = () => {
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={serverError} mb="mbFour" />
            <Typography variant="h5" color="textHeading" mb="mbOne">
              Device Authentication has failed
            </Typography>
            <Typography variant="h6" color="textMuted">
              The server seems to be down try connecting again after some time
            </Typography>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            <Link to={ONBOARDING_ROUTE_DEVICE_AUTH_TEST}>
              <Button variation="primary">Retry</Button>
            </Link>
            
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};

export const DeviceAuthTestFailedDeviceMisconfigured = () => {
  const [popupSupport, setPopupSupport] = useState(false);
  const [popupAppClose, setPopupAppClose] = useState(false);
  const clickSupportClose = () => {
    setPopupSupport(false);
  }
  const toggleAppClose = () => {
    setPopupAppClose((popup) => !popup);
  }
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={setting} mb="mbFour" />

            <Typography variant="h5" color="textHeading" mb="mbOne">
              Device Authentication has failed
            </Typography>
            <Typography variant="h6" color="textMuted">
              Device seems to be misconfigured. Contact Cypherock support
              immediately
            </Typography>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            <Button variation="primary"
            onClick={() => setPopupSupport((wasOpen) => !wasOpen)}
            >
              Contact Support
            </Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>

      {popupSupport===true &&  <Support clickSupportClose={clickSupportClose} appCloseOpen={toggleAppClose}/>}
      {popupAppClose===true && <AppClose />}

    </Flex>
  );
};
