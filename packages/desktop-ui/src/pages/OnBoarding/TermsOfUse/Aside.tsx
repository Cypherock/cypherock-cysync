import React from 'react';
import { Container, Flex, Typography } from '../../../components';

// import sysync from '@assets/images/logo-small.png';
// import aside from '@assets/images/aside.png';
// import progress from '@assets/images/terms-progress.png';

export const Aside = () => (
  <Container
    variant="asideContainer"
    bgColor="sideBar"
    size="lg"
    direction="column"
    justify="between"
    align="center"
  >
    {/* <Image src={sysync} alignSelf="start" /> */}
    <Flex direction="column" align="center">
      {/* <Image src={aside} /> */}
    </Flex>
    <Flex direction="column" width="wFull" align="center">
      <Typography
        variant="h2"
        color="textSilver"
        width="wFull"
        textAlign="center"
        mb="mbThree"
        font="fontMedium"
      >
        Terms of Use
      </Typography>
      {/* <Image src={progress} /> */}
    </Flex>
  </Container>
);
