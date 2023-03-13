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
import appupdate from "@assets/images/app-update-progress.png"
import { Aside } from "./Aside";
import { Link } from "react-router-dom";
  
export const AppUpdateProgress = () => {
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
                    <Image src={appupdate} mb="mbFive" />
                    <Typography variant="h5" color="textHeading" mb="mbTwo">
                        Updating...
                    </Typography>

                    <Typography variant="h6" color="textMuted" mb="mbFour">
                        Wait while we update your cySync app
                    </Typography>

                    <Typography variant="h6" color="textMuted" textAlign="left"> Version 0.2.56 </Typography>
                    
                    {/* TODO: Create a Loading progress bar */}
                </DialogueBoxBody>
            </DialogueBoxContainer>
        </Container>
        </Flex>
    );
};
  