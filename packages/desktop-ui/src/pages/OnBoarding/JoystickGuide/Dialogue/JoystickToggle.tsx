import React, { ReactElement } from 'react';
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Bullet,
  Typography,
  Flex,
  Container,
  Image,
} from '../../../../components';
import joystick from '../../../../assets/images/onboarding/joystick/joystick.png';
import { Aside } from '../Aside/Aside';

export const JoyStickToggle = (): ReactElement => (
  <Flex gap="gap0">
    <Aside />
    <Container variant="container" bgColor="contentGratient">
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Typography variant="h4" color="textHeading" mb="mbSeven">
            Toggle Up
          </Typography>

          <Flex align="center" direction="column" mb="mbTwo">
            <Typography color="textSuccess" mb="mbOne">
              Up
            </Typography>
            <Bullet variant="success" size="lg" />
          </Flex>

          <Flex align="center" justify="center" mb="mbTwo">
            <Flex align="center">
              <Typography color="textMuted" mr="mrOne">
                {' '}
                Left
              </Typography>
              <Bullet variant="outline" />
            </Flex>

            <Image src={joystick} ml="mlTwo" mr="mrTwo" />

            <Flex align="center">
              <Bullet size="lg" variant="gold" />
              <Typography color="textGold" ml="mlOne">
                {' '}
                Right
              </Typography>
            </Flex>
          </Flex>

          <Flex align="center" direction="column" mb="mbSeven">
            <Bullet variant="failed" size="lg" />
            <Typography color="textError" mt="mtOne">
              {' '}
              Down
            </Typography>
          </Flex>

          <Typography variant="h5" color="textHeading">
            X1 Vault provides 4 way joystick for screen navigation
          </Typography>
          <Typography variant="h6" color="textMuted" mt="mtTwo">
            Follow the instruction on the device
          </Typography>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
