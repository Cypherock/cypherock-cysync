import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  DialogueBoxFooter,
  Button,
  Typography,
} from "@components";
import failed from "@/assets/images/onboarding/deviceAuth/fail.png";

export const SupplyChainAttack = () => {
  return (
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
        <Button variation="primary"> Contact Support</Button>
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
