import React, { ReactElement } from 'react';
import sysync from '../../../assets/images/common/logo-small.png';
import { Container, Flex, Image, Typography } from '../../../components';
import aside from '../../../assets/images/common/aside.png';
import progress from '../../../assets/images/common/set-pass-progression.png';

export const Aside = (): ReactElement => (
  <Container
    variant="asideContainer"
    bgColor="sideBar"
    size="lg"
    direction="column"
    justify="between"
    align="center"
  >
    <Image src={sysync} alignSelf="start" />
    <Flex direction="column" align="center">
      <Image src={aside} />
    </Flex>
    <Flex direction="column" width="wFull" align="center">
      <Typography
        variant="h4"
        color="textSilver"
        width="wFull"
        textAlign="center"
        mb="mbThree"
      >
        Email 2FA
      </Typography>
      <Image src={progress} />
    </Flex>
  </Container>
);
