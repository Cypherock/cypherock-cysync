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
  Container
} from "@components";
import { Link } from "react-router-dom";
import { Aside } from "../Aside";

export const Support = () => {
  return (
  <Flex gap="gap0">
    <Aside />
    <Container variant="container" bgColor="contentGratient">
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
          <Link to="/closeApp">
            <Button variation="primary">Submit & Close app</Button>
          </Link>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </Container>
  </Flex>
  );
};
