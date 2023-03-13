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
import appupdate from "@assets/images/app-update.png"
import { Aside } from "./Aside";
import { Link } from "react-router-dom";
  
export const AppUpdate = () => {
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
                        Update Available
                    </Typography>

                    <Typography variant="h6" color="textMuted">
                        Your X1 Vault seems to be incompatible with the current cySync app. 
                        Update your desktop app to v1.2 to continue
                    </Typography>
                </DialogueBoxBody>

                <DialogueBoxFooter>
                
                <Link to="/appUpdateProgress">
                    <Button variation="primary">Update</Button>
                </Link>
                
                </DialogueBoxFooter>
            </DialogueBoxContainer>
        </Container>
        </Flex>
    );
};
  