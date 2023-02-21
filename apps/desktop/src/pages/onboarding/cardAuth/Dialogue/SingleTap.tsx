import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Typography,
  Container,
  Flex,
  Bullet,
} from "@components";

export const SingleTap = () => {
  return (
    <DialogueBoxContainer md>
      <DialogueBoxBody>
        <Typography variant="h5" color="textHeading">
          Tap any X1 Card below the X1 Vault to test card tapping
        </Typography>
        <Typography variant="h6" color="textMuted" mb="mbFive">
          Your X1 card communicates with the X1 Vault through encrypted NFC.
          Make sure you keep it tapped until you hear a beep sound
        </Typography>

        <Container bgColor="list" border rounded="roundedOne">
          <Flex alignCenter justifyBetween>
            <Typography variant="h6" mb="mb0" color="textMuted">
              X1 Card
            </Typography>
            <Bullet size="lg" variant="gold" />
          </Flex>
        </Container>
      </DialogueBoxBody>
    </DialogueBoxContainer>
  );
};
