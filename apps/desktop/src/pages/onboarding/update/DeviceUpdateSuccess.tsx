import {
    DialogueBoxContainer,
    DialogueBoxBody,
    Image,
    Typography,
    Flex,
    Container,
} from "@components";
import updateSuccess from "@assets/images/onboarding/setPass/success.png"
import { Aside } from "./Aside";
  
export const DeviceUpdateSuccess = () => {
    return (
        <Flex gap="gap0">
        <Aside screeName="Device Update"/>
        <Container variant="container" bgColor="contentGratient">
            <Flex position="absolute" top="topThree" right="rightThree">
            <Typography color="textMuted">Help</Typography>
            <Typography color="textGold">?</Typography>
            </Flex>

            <DialogueBoxContainer md>
                <DialogueBoxBody>
                    <Image src={updateSuccess} mb="mbFive" />
                    <Typography variant="h5" color="textHeading" mb="mbTwo">
                        X1 Vault updated successfully
                    </Typography>

                    <Typography variant="h6" color="textMuted">
                        Your X1 Vault is now operating on the latest software version
                    </Typography>
                </DialogueBoxBody>

            </DialogueBoxContainer>
        </Container>
        </Flex>
    );
};
  