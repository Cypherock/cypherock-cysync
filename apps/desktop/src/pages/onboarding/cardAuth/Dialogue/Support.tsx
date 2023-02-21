import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxTopBar,
  InputContainer,
  Input,
  InputLabel,
  Flex,
  Typography,
  CheckBox,
  DialogueBoxFooter,
  Button,
  Divider,
} from "@components";
import exiting from "./exiting.png";

export const Support = () => {
  return (
    <DialogueBoxContainer md>
      <DialogueBoxTopBar>
        <Typography variant="h6" color="textMuted">
          Contact us
        </Typography>
      </DialogueBoxTopBar>
      <DialogueBoxBody>
        <Typography variant="h5" color="textHeading">
          How can we help
        </Typography>
        <Typography variant="h6" color="textMuted" mb="mbSix">
          Our friendly team would love to hear from you
        </Typography>

        <InputContainer>
          <InputLabel> Email</InputLabel>
          <Input type="text" placeholder="Your email" />
          {/* <img src={passwordHide} alt="" /> */}
        </InputContainer>
        <Flex alignCenter mb="mbTwo">
          <CheckBox variation="squareCheckBox">
            <div>
              <input type="checkbox" />
            </div>
          </CheckBox>
          <Typography color="textMuted">Attach Application Logs</Typography>
        </Flex>

        <Flex alignCenter mb="mbTwo">
          <CheckBox variation="squareCheckBox">
            <div>
              <input type="checkbox" />
            </div>
          </CheckBox>
          <Typography color="textMuted">Attach Application Logs</Typography>
        </Flex>
        <Divider mb="mbThree" />
        <Typography variant="h6" mb="mbEight" color="textMuted">
          Your Password is incorrect
        </Typography>
      </DialogueBoxBody>
      <DialogueBoxFooter>
        <Button variation="secondary"> Cancel </Button>
        <Button variation="primary">Submit & Close app</Button>
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
