import {
  AsideContainer,
  Container,
  Flex,
  Image,
  Typography,
  cysyncLogoBig,
  cysyncLogoSmall,
} from '@cypherock/cysync-ui';
import React, { ReactElement } from 'react';

export const Aside = (): ReactElement => (
  <AsideContainer
    $bgColor="sideBar"
    size="lg"
    height="screen"
    direction="column"
    justify="space-between"
    align="center"
  >
    <Image src={cysyncLogoSmall} alt="logo" $alignSelf="start" />
    <Flex direction="column" align="center">
      <Container
        $bgColor="list"
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
        cySync App
      </Typography>
      <Typography variant="h4" color="silver" font="medium" mb={2}>
        Welcome to Cypherock
      </Typography>
      <Typography variant="h6" color="muted">
        Your Gateway to Self-Sovereignty
      </Typography>
    </Flex>
    <Typography color="muted" $textAlign="center" width="full">
      ver 2. 314. 3094
    </Typography>
  </AsideContainer>
);
