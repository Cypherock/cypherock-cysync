import React, { ReactElement } from 'react';
import { Container, Flex, Image, Typography } from '@cypherock/cysync-ui';
import { Aside } from './Aside';
import { loader } from '../../../assets/images/onboarding';

export const DeviceAuthTest = (): ReactElement => (
  <Container $bgColor="sideBar">
    <Aside />
    <Container
      $bgColor="contentGradient"
      height="screen"
      width="full"
      align="center"
      justify="center"
      shadow="popup"
    >
      <Container
        $bgColor="primary"
        align="center"
        justify="center"
        width="1/2"
        shadow="popup"
      >
        <Flex direction="column" gap={26} align="center" justify="center">
          <Image src={loader} alt="loader" />
          <Typography variant="h5" $textAlign="center">
            Your X1 Vault will now be authenticated through Cypherock to check
            its authenticity (?)
          </Typography>
        </Flex>
      </Container>
    </Container>
  </Container>
);
