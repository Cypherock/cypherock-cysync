import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Flex,
  Image,
  Typography,
  backIcon,
} from '@cypherock/cysync-ui';
import { Aside } from './Aside';
import { loader } from '../../../assets/images/onboarding';

export const DeviceAuthTest = (): ReactElement => (
  <Container height="screen" $bgColor="sideBar">
    <Aside />
    <Container
      $bgColor="contentGradient"
      height="full"
      width="full"
      align="center"
      position="relative"
      justify="center"
    >
      <Container
        $bgColor="primary"
        align="center"
        justify="center"
        width="1/2"
        shadow="popup"
        px={3}
        py={3}
      >
        <Flex direction="column" gap={26} align="center" justify="center">
          <Image src={loader} alt="loader" />
          <Typography variant="h5" $textAlign="center">
            Your X1 Vault will now be authenticated through Cypherock to check
            its authenticity(?)
          </Typography>
        </Flex>
      </Container>
      <Link to="/">
        <Flex position="absolute" left={16} bottom={16} gap={12} align="center">
          <Image src={backIcon} alt="back" />
          <Typography color="muted">Back</Typography>
        </Flex>
      </Link>
    </Container>
  </Container>
);
