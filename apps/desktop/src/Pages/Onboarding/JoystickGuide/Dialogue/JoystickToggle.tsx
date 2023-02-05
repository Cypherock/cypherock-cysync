import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Flex,
  Bullet,
  Typography,
} from "@/component";
import joystick from "@/assets/images/onboarding/joystick/joystick.png";

export const JoyStickToggle = () => {
  return (
    <DialogueBoxContainer md>
      <DialogueBoxBody>
        <Typography variant="h4" color="textHeading" mb="mbSeven">
          Toggle Up
        </Typography>

        <Flex alignCenter column mb="mbTwo">
          <Typography color="textSuccess">Up</Typography>
          <Bullet variant="success" size="lg" />
        </Flex>

        <Flex alignCenter justifyCenter mb="mbTwo">
          <Flex alignCenter>
            <Typography color="textMuted"> Left</Typography>

            <Bullet variant="outline" />
          </Flex>

          <Image src={joystick} />
          {/* <DefaultContainer list roundedFull pThree></DefaultContainer> */}
          <Flex alignCenter>
            <Bullet size="lg" variant="gold" />
            <Typography color="textGold"> Right</Typography>
          </Flex>
        </Flex>

        <Flex alignCenter column mb="mbSeven">
          <Bullet variant="failed" size="lg" />
          <Typography color="textError"> Down</Typography>
        </Flex>
        <Typography variant="h5" color="textHeading">
          X1 Vault provides 4 way joystick for screen navigation
        </Typography>
        <Typography variant="h6" color="textMuted">
          Follow the instruction on the device
        </Typography>
      </DialogueBoxBody>
    </DialogueBoxContainer>
  );
};
