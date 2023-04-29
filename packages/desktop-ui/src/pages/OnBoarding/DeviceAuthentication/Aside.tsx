import React, { ReactElement } from 'react';
import { Container, Flex, Image, Typography } from '../../../components';
import sysync from '../../../assets/images/common/logo-small.png';
import aside from '../../../assets/images/common/deviceAuth.png';
import progress from '../../../assets/images/common/card-progress.png';

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
        variant="h2"
        color="textSilver"
        width="wFull"
        textAlign="center"
        mb="mbThree"
        font="fontMedium"
      >
        Device Authentication
      </Typography>
      <Image src={progress} />
    </Flex>
  </Container>
);
