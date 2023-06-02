import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Aside,
  Bullet,
  Button,
  CheckBox,
  Container,
  Flex,
  Image,
  asideIcon,
  termsLinkImage,
  Typography,
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
} from '@cypherock/cysync-ui';
import { routes } from '../../config';

export const Terms = (): ReactElement => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Flex gap={0}>
      <Aside
        currentState={1}
        totalState={8}
        text="Terms Of Use"
        img={asideIcon}
      />
      <Container width="full" $bgColor="contentGradient">
        <DialogBoxBackground gap={20}>
          <DialogBoxBackgroundHeader email={false} help />
          <DialogBox width={500} height={454} direction="column">
            <DialogBoxHeader mt={2} justify="center" width="full">
              <Typography variant="h5" color="heading">
                Terms of use
              </Typography>
            </DialogBoxHeader>
            <DialogBoxBody gap={16} direction="column" align="center">
              <Container
                width="full"
                rounded={8}
                px={3}
                py={10}
                $bgColor="separatorSecondary"
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
                width="full"
                rounded={8}
                px={3}
                py={10}
                $bgColor="separatorSecondary"
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
                <CheckBox
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                />
                <Typography
                  fontSize={14}
                  color="muted"
                  $textAlign="left"
                  ml={2}
                >
                  I have read and agree with the Terms of Use and Privacy Policy
                </Typography>
              </Flex>
            </DialogBoxBody>
            <DialogBoxFooter>
              {isChecked ? (
                <Link to={routes.onboarding.deviceAuthentication.path}>
                  <Button variant="primary">Confirm</Button>
                </Link>
              ) : (
                <Button variant="secondary" disabled>
                  Confirm
                </Button>
              )}
            </DialogBoxFooter>
          </DialogBox>
        </DialogBoxBackground>
      </Container>
    </Flex>
  );
};
