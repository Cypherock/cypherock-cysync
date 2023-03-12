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
import { Link } from "react-router-dom";

export const SupplyChainAttack = () => {
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
            <Link to="/contactSupport">
              <Button variation="primary"> Contact Support</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
