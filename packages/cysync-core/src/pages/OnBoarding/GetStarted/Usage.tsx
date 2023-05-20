import { Link } from 'react-router-dom';
import React, { ReactElement } from 'react';
import {
  Button,
  Container,
  DialogueBoxBody,
  DialogueBoxContainer,
  DialogueBoxFooter,
  Flex,
  Image,
  Typography,
} from '@cypherock/cysync-ui';
import { Aside } from './Aside';
import { usageIcon } from '../../../assets/images/onboarding';

export const Usage = (): ReactElement => (
  <Flex gap={0} position="relative">
    <Aside />
    <Container width="full" $bgColor="contentGradient">
      <Flex $directionL="row" direction="column" gap={16}>
        <Flex position="absolute" top={30} right={26} gap={12}>
          <Typography color="muted">Help</Typography>
          <Typography color="gold">?</Typography>
        </Flex>
        <DialogueBoxContainer
          direction="column"
          width={458}
          $widthL={500}
          height={276}
          $heightL={483}
        >
          <DialogueBoxBody
            grow={2}
            align="center"
            $gapL={43.5}
            gap={26}
            direction="column"
            height="full"
          >
            <Image width={45} src={usageIcon} alt="usageIcon" />
            <Flex gap={16} direction="column" height="full">
              <Typography variant="h5" color="heading" mb={1}>
                I am using Cypherock X1 for the first time
              </Typography>
              <Container
                height="full"
                rounded={8}
                display="none"
                $displayL="block"
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
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to="/termsOfUse">
              <Button variant="primary">Continue</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
        <DialogueBoxContainer
          direction="column"
          width={458}
          $widthL={500}
          height={276}
          $heightL={483}
        >
          <DialogueBoxBody
            align="center"
            direction="column"
            grow={1}
            $gapL={43.5}
            gap={26}
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
                display="none"
                $displayL="block"
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
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to="/termsOfUse">
              <Button variant="primary">Continue</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Flex>
    </Container>
  </Flex>
);
