import {
    DialogueBoxContainer,
    DialogueBoxBody,
    Image,
    Typography,
    Flex,
    Container,
} from "@components";
import appupdate from "@assets/images/app-update-progress.png"
import { Aside } from "./Aside";
  
export const DeviceUpdateProgress = () => {
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

                    <Typography variant="h6" color="textMuted">
                        Please wait while we update your X1 Vault
                    </Typography>

                </DialogueBoxBody>
            </DialogueBoxContainer>
        </Container>
        </Flex>
    );
};
  