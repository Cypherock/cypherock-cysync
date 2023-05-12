import { useNavigate } from 'react-router-dom';
import React, { ReactElement, useEffect } from 'react';
import { Container, Flex, Typography } from '@cypherock/cysync-ui';
// import logger from '../../../utils/logger';

export const Splash = (): ReactElement => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/information');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);
  return (
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
          {/* <Image src={sysyncbig} /> */}
        </Container>

        <Typography variant="h3" color="gold" mb={7}>
          cySync App
        </Typography>
        <Typography variant="h4" color="silver" font="medium" mb={2}>
          Welcome to Cypherock
        </Typography>
        <Typography variant="h6" color="muted">
          Your Gateway to Self-Sovereignty
        </Typography>
        <Typography color="muted" textAlign="center" width="wFull" mt={3}>
          ver 2. 314. 3094
        </Typography>
      </Flex>
    </Container>
  );
};
