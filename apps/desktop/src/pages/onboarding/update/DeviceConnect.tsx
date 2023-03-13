import {
    DialogueBoxContainer,
    DialogueBoxBody,
    Image,
    Typography,
    Flex,
    Container,
  } from "@components";
  import loader from "@assets/images/onboarding/deviceAuth/loader.png";
  import { Aside } from "./Aside";
  
  export const DeviceConnect = () => {
    return (
      <Flex gap="gap0">
        <Aside screeName="Device Connection"/>
        <Container variant="container" bgColor="contentGratient">
          <Flex position="absolute" top="topThree" right="rightThree">
            <Typography color="textMuted">Help</Typography>
            <Typography color="textGold">?</Typography>
          </Flex>
  
          <DialogueBoxContainer md>
            <DialogueBoxBody>
              <Image src={loader} mb="mbFive" />
              <Typography variant="h5" color="textHeading" mb="mbTwo">
                Connecting X1 Vault
              </Typography>
  
              <Typography variant="h6" color="textMuted">
                Connect your X1 Vault to your PC to proceed
              </Typography>
            </DialogueBoxBody>
          </DialogueBoxContainer>
        </Container>
      </Flex>
    );
  };
  