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

export const Support = () => {
  return (
    <DialogueBoxContainer md>
      <DialogueBoxTopBar>
        <Typography variant="h6" color="textMuted">
          Contact Support
        </Typography>
      </DialogueBoxTopBar>
      <DialogueBoxBody>
        <Typography variant="h5" color="textHeading" mb="mbTwo">
          How can we help ?
        </Typography>
        <Typography variant="h6" color="textMuted" mb="mbSix">
          Our friendly team would love to hear from you
        </Typography>

        <InputContainer>
          <InputLabel> Email</InputLabel>
          <Input type="email" placeholder="Your email" />
        </InputContainer>

        <InputContainer>
          <InputLabel> Category</InputLabel>
          <Input type="text" placeholder="Supply Chain Attack" />
        </InputContainer>

        <InputContainer>
          <InputLabel> Description</InputLabel>
          <Input type="text" placeholder="Describe Your Issue here" />
        </InputContainer>


        <Flex alignCenter mb="mbTwo">
          <CheckBox variation="squareCheckBox">
            <div>
              <input type="checkbox" />
            </div>
          </CheckBox>
          <Typography ml="mlTwo" color="textMuted">Attach Application Logs</Typography>
        </Flex>

        <Flex alignCenter mb="mbTwo">
          <CheckBox variation="squareCheckBox">
            <div>
              <input type="checkbox" />
            </div>
          </CheckBox>
          <Typography ml="mlTwo" color="textMuted">Attach Device Logs</Typography>
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
