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
  Container,
  Image,
  InputTextArea,
  SelectContainer
} from "@components";
import { Link } from "react-router-dom";
import close from "@/assets/images/close.png";

interface SupportProps {
  clickSupportClose?: () => void;
  appCloseOpen?: () => void;
};

export const Support = (props: SupportProps) => {
  return (
    <Container position="absolute" variant="modalContainer" justify="center" align="center">
      <Flex>
      <DialogueBoxContainer md>
        <DialogueBoxTopBar>
          <Flex justify="end">
            <Typography variant="h6" color="textMuted" ml="mlAuto" mr="mrAuto">
              Contact Support
            </Typography>
            <div onClick={() => props.clickSupportClose()}>
                <Image src={close} />
            </div>
          </Flex>
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
            <SelectContainer>
              <select>
                <option value="supplychainattack">Supply Chain Attack</option>
                <option value="updatefailed">Update Failed</option>
              </select>        
            </SelectContainer>    
          </InputContainer>

          <InputContainer>
            <InputLabel> Description</InputLabel>
            <InputTextArea type="text" placeholder="Describe Your Issue here" />
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
          <Button variation="secondary" onClick={() => props.clickSupportClose()}> Cancel </Button>
          <Button variation="primary" onClick={() => {
            props.clickSupportClose()
            props.appCloseOpen()
          }}>
            Submit & Close app
          </Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
      </Flex>
    </Container>
  );
};
