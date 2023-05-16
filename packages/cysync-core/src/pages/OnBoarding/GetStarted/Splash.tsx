// import { useNavigate } from 'react-router-dom';
import React, { ReactElement } from 'react';
import {
  Container,
  Flex,
  Image,
  Typography,
  // Typography,
  cysyncLogoBig,
} from '@cypherock/cysync-ui';

export const Splash = (): ReactElement => (
  <Container
    bgColor="sideBar"
    size="lg"
    direction="column"
    justify="space-between"
    align="center"
  >
    <Flex direction="column" align="center">
      <Container
        bgColor="list"
        rounded="full"
        pb={5}
        pl={5}
        pr={5}
        pt={5}
        mb={3}
      >
        <Image src={cysyncLogoBig} alt="logo" />
      </Container>
      <Typography variant="h3" color="gold" mb={7}>
        {' '}
        cySync App
      </Typography>
      <Typography variant="h4" color="silver" font="medium" mb={2}>
        Welcome to Cypherock
      </Typography>
      <Typography variant="h6" color="muted">
        Your Gateway to Self-Sovereignty
      </Typography>
      <Typography color="muted" textAlign="center" width="full" mt={3}>
        ver 2. 314. 3094
      </Typography>
    </Flex>
  </Container>
);
