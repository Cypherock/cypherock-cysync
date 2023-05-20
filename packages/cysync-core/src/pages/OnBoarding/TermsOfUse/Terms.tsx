import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Aside,
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
import { termsLinkImage } from '../../../assets/images/onboarding';

export const Terms = (): ReactElement => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Flex gap={0}>
      <Aside asideImage="common" progress={1} title="Terms of Use" />
      <Container position="relative" width="full" $bgColor="contentGradient">
        <Flex position="absolute" top={30} right={26} gap={12}>
          <Typography color="muted">Help</Typography>
          <Typography color="gold">?</Typography>
        </Flex>

        <DialogueBoxContainer direction="column" align="center">
          <DialogueBoxBody direction="column" align="center">
            <Container $bgColor="separator" px={3} py={4}>
              <Typography variant="h5" color="heading" mb={2}>
                Terms of use
              </Typography>
            </Container>
            <Container>
              <Typography variant="h6" color="muted" mb={6}>
                Please take some time to review our Terms of Service and Privacy
                Policy
              </Typography>
            </Container>

            <Container
              mb={2}
              width="full"
              rounded={1}
              px={2}
              py={2}
              $bgColor="list"
              border="popup"
            >
              <Flex justify="space-between" align="center" width="full">
                <Flex align="center" gap={16}>
                  <Bullet size="sm" />
                  <Typography variant="h6" color="heading">
                    Terms of Service
                  </Typography>
                </Flex>

                <Image
                  src={termsLinkImage}
                  width={12}
                  height={12}
                  alt="termsLink"
                />
              </Flex>
            </Container>

            <Container
              mb={3}
              width="full"
              rounded={1}
              px={2}
              py={2}
              $bgColor="list"
              border="popup"
            >
              <Flex justify="space-between" align="center" width="full">
                <Flex align="center" gap={16}>
                  <Bullet size="sm" />

                  <Typography variant="h6" color="heading">
                    Privacy Policy
                  </Typography>
                </Flex>

                <Image
                  src={termsLinkImage}
                  width={12}
                  height={12}
                  alt="termsLink"
                />
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

        <Link to="/">
          <Flex
            position="absolute"
            left={16}
            bottom={16}
            gap={12}
            align="center"
          >
            <Image src={backIcon} alt="back" />
            <Typography color="muted">Back</Typography>
          </Flex>
        </Link>
      </Container>
    </Flex>
  );
};
