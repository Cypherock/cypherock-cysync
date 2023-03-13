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
  
export const UpdateFailed = () => {
    const [popup, setPopup] = useState(false);
    const clickClose = () => {
        setPopup(false);
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
                        onClick={() => setPopup((wasOpen) => !wasOpen)}
                    >
                        Report
                    </Button>

                    <Link to="/appInUpdate">
                        <Button variation="primary">Retry</Button>
                    </Link>
                </DialogueBoxFooter>

            </DialogueBoxContainer>
        </Container>

        {popup===true &&  <Support clickClose={clickClose}/>}
        </Flex>
    );
};
  