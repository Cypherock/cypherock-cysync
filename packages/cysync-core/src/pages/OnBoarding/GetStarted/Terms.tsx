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
import { routes } from '../../../config';

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
          <DialogBox direction="column">
            <DialogBoxHeader justify="center" width="full" px={3} py={4}>
              <Typography variant="h5" color="heading" mb={2}>
                Terms of use
              </Typography>
            </DialogBoxHeader>
            <DialogBoxBody direction="column" align="center">
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
                <CheckBox
                  onChange={() => setIsChecked(!isChecked)}
                  variant="square"
                />
                <Typography color="muted" $textAlign="left" ml={2}>
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
