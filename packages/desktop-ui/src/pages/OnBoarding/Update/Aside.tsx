import React, { ReactElement } from 'react';
import { Container, Image, Flex, Typography } from '../../../components';
import sysync from '../../../assets/images/common/logo-small.png';
import aside from '../../../assets/images/common/aside.png';
import progress from '../../../assets/images/common/terms-progress.png';

interface AsideProps {
  screeName: string;
}

export const Aside = ({ screeName }: AsideProps): ReactElement => (
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
        {screeName}
      </Typography>
      <Image src={progress} />
    </Flex>
  </Container>
);
