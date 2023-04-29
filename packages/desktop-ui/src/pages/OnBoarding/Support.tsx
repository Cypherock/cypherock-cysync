import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
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
  InputTextArea,
  SelectContainer,
  Image,
} from '../../components';
import close from '../../assets/images/common/close.png';

interface SupportProps {
  clickClose?: () => void;
}

export const Support = (props: SupportProps): ReactElement => (
  <Container
    position="absolute"
    variant="modalContainer"
    justify="center"
    align="center"
  >
    <Flex>
      <DialogueBoxContainer md>
        <DialogueBoxTopBar>
          <Flex justify="end">
            <Typography variant="h6" color="textMuted" ml="mlAuto" mr="mrAuto">
              Contact Support
            </Typography>
            <button
              type="button"
              onClick={() => {
                const { clickClose } = props;
                if (clickClose) clickClose();
              }}
            >
              <Image src={close} />
            </button>
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

          <Flex mb="mbTwo">
            <CheckBox variation="squareCheckBox">
              <div>
                <input type="checkbox" />
              </div>
            </CheckBox>
            <Typography ml="mlTwo" color="textMuted">
              Attach Application Logs
            </Typography>
          </Flex>

          <Flex mb="mbTwo">
            <CheckBox variation="squareCheckBox">
              <div>
                <input type="checkbox" />
              </div>
            </CheckBox>
            <Typography ml="mlTwo" color="textMuted">
              Attach Device Logs
            </Typography>
          </Flex>
          <Divider mb="mbThree" />
          <Typography variant="h6" mb="mbEight" color="textMuted">
            Your Password is incorrect
          </Typography>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button
            variation="secondary"
            onClick={() => {
              const { clickClose } = props;
              if (clickClose) clickClose();
            }}
          >
            {' '}
            Cancel{' '}
          </Button>
          <Link to="/closeApp">
            <Button variation="primary">Submit & Close app</Button>
          </Link>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </Flex>
  </Container>
);

Support.defaultProps = {
  clickClose: () => null,
};
