import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bullet,
  Button,
  CheckBox,
  Container,
  DialogueBoxBody,
  DialogueBoxContainer,
  DialogueBoxFooter,
  Flex,
  Image,
  Typography,
  backIcon,
} from '@cypherock/cysync-ui';
import { Aside } from './Aside';
import { termsLinkImage } from '../../../assets/images/onboarding';

export const Terms = (): ReactElement => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Flex gap={0}>
      <Aside />
      <Container $bgColor="contentGradient">
        <Flex position="absolute" top={3} right={3}>
          <Typography color="muted">Help</Typography>
          <Typography color="gold">?</Typography>
        </Flex>

        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Typography variant="h5" color="heading" mb={2}>
              Terms of use
            </Typography>
            <Typography variant="h6" color="muted" mb={6}>
              Please take some time to review our Terms of Service and Privacy
              Policy
            </Typography>

            <Container mb={2} rounded={1} $bgColor="list" border="popup">
              <Flex justify="space-between" width="wFull">
                <Flex align="center" gap={2}>
                  <Bullet size="sm" />
                  <Typography variant="h6" color="heading">
                    Terms of Service
                  </Typography>
                </Flex>

                <Image src={termsLinkImage} alt="termsLink" />
              </Flex>
            </Container>

            <Container mb={3} rounded={1} $bgColor="list" border="popup">
              <Flex justify="space-between" width="wFull">
                <Flex align="center" gap={2}>
                  <Bullet size="sm" />

                  <Typography variant="h6" color="heading">
                    Privacy Policy
                  </Typography>
                </Flex>

                <Image src={termsLinkImage} alt="termsLink" />
              </Flex>
            </Container>

            <Flex align="center">
              <CheckBox variant="square">
                <div>
                  <input
                    type="checkbox"
                    onClick={() => setIsChecked(wasCheched => !wasCheched)}
                  />
                </div>
              </CheckBox>
              <Typography color="muted" $textAlign="left" ml={2}>
                I have read and agree with the Terms of Use and Privacy Policy
              </Typography>
            </Flex>
          </DialogueBoxBody>

          <DialogueBoxFooter>
            {isChecked ? (
              <Link to="/deviceAuthTest">
                <Button variant="primary">Confirm</Button>
              </Link>
            ) : (
              <Button variant="secondary" disabled>
                Confirm
              </Button>
            )}
          </DialogueBoxFooter>
        </DialogueBoxContainer>

        <Link to="/welcome">
          <Flex position="absolute" bottom={3} gap={1} align="center">
            <Image src={backIcon} alt="back" />
            <Typography color="muted">Back</Typography>
          </Flex>
        </Link>
      </Container>
    </Flex>
  );
};
