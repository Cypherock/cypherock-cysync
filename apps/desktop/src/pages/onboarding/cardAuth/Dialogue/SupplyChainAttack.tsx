import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  DialogueBoxFooter,
  Button,
  Typography,
  Container,
  Flex
} from "@components";
import failed from "@/assets/images/onboarding/deviceAuth/fail.png";
import { Aside } from "../Aside";
import { Support } from "../../Support";
import { AppClose } from "../../AppClose";

export const SupplyChainAttack = () => {
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
            <Image src={failed} mb="mbThree" />
            <Typography variant="h5" color="textHeading">
              Supply chain compromised
            </Typography>
            <Typography variant="h6" color="textMuted" mt="mtTwo">
              Your Cypherock X1 might have been compromised. Contact Cypherock
              support immediately. Close the app after you have contacted the
              support
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
