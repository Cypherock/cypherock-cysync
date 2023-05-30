import { Link } from 'react-router-dom';
import React, { ReactElement } from 'react';
import {
  Aside,
  Button,
  Container,
  DialogBox,
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  Typography,
  cysyncLogoBig,
  usageIcon,
} from '@cypherock/cysync-ui';
import { routes } from '../../../config';

export const Usage = (): ReactElement => (
  <Flex gap={0} position="relative">
    <Aside type="getStarted" img={cysyncLogoBig} />
    <Container width="full" $bgColor="contentGradient">
      <DialogBoxBackground
        gap={20}
        direction={{
          def: 'column',
          lg: 'row',
        }}
      >
        <DialogBoxBackgroundHeader email={false} help />
        <DialogBox
          direction="column"
          width={{
            def: 458,
            lg: 500,
          }}
          height={{
            def: 276,
            lg: 483,
          }}
        >
          <DialogBoxBody
            grow={2}
            align="center"
            gap={{ def: 26, lg: 43.5 }}
            direction="column"
            height="full"
          >
            <Image width={45} src={usageIcon} alt="usageIcon" />
            <Flex gap={16} direction="column" height="full">
              <Typography
                $alignSelf="center"
                variant="h5"
                color="heading"
                mb={1}
              >
                I am using Cypherock X1 for the first time
              </Typography>
              <Container
                height="full"
                rounded={8}
                display={{ def: 'none', lg: 'block' }}
                $bgColor="input"
                px={2}
                py={3}
                align="flex-start"
              >
                <Typography variant="h6" color="muted">
                  Choose this if you have never used Cypherock X1 before
                </Typography>
              </Container>
            </Flex>
          </DialogBoxBody>
          <DialogBoxFooter>
            <Link to="/terms">
              <Button variant="primary">Continue</Button>
            </Link>
          </DialogBoxFooter>
        </DialogBox>
        <DialogBox
          direction="column"
          width={{ def: 458, lg: 500 }}
          height={{ def: 276, lg: 483 }}
        >
          <DialogBoxBody
            align="center"
            direction="column"
            grow={1}
            gap={{ def: 26, lg: 43.5 }}
            justify="evenly"
            height="full"
          >
            <Image src={usageIcon} alt="usageIcon" />
            <Flex gap={16} height="full" direction="column">
              <Typography
                $textAlign="center"
                variant="h5"
                color="heading"
                mb={1}
              >
                I have already used a Cypherock X1
              </Typography>
              <Container
                height="full"
                rounded={8}
                $bgColor="input"
                align="flex-start"
                display={{ def: 'none', lg: 'block' }}
                px={2}
                py={3}
              >
                <Typography variant="h6" color="muted">
                  Choose this if you want to migrate your wallets to a new
                  Cypherock X1. This might be required in case your lost your X1
                  wallet and one or more of the X1 cards.
                </Typography>
              </Container>
            </Flex>
          </DialogBoxBody>
          <DialogBoxFooter>
            <Link to={routes.onboardingRoutes.terms.path}>
              <Button variant="primary">Continue</Button>
            </Link>
          </DialogBoxFooter>
        </DialogBox>
      </DialogBoxBackground>
    </Container>
  </Flex>
);
