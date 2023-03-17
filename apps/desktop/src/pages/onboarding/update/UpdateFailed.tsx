import {
    DialogueBoxContainer,
    DialogueBoxBody,
    Image,
    Typography,
    Flex,
    Container,
    DialogueBoxFooter,
    Button
} from "@components";
import updatefail from "@assets/images/update-fail.png"
import { Aside } from "./Aside";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Support } from "../Support";
import { AppClose } from "../AppClose";
import { ONBOARDING_ROUTE_UPDATE_APP } from "../../../routes/constantRoutePath";
  
export const UpdateFailed = () => {
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
        <Aside screeName="App Update"/>
        <Container variant="container" bgColor="contentGratient">
            <Flex position="absolute" top="topThree" right="rightThree">
            <Typography color="textMuted">Help</Typography>
            <Typography color="textGold">?</Typography>
            </Flex>

            <DialogueBoxContainer md>
                <DialogueBoxBody>
                    <Image src={updatefail} mb="mbFive" />
                    <Typography variant="h5" color="textHeading" mb="mbTwo">
                        cySync app update to version 0.22.56 failed
                    </Typography>

                    <Typography variant="h6" color="textMuted">
                        Something went wrong, try updating again or contact support
                    </Typography>
                </DialogueBoxBody>

                <DialogueBoxFooter>
                    <Button variation="secondary"
                        onClick={() => setPopupSupport((wasOpen) => !wasOpen)}
                    >
                        Report
                    </Button>

                    <Link to={ONBOARDING_ROUTE_UPDATE_APP}>
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
  