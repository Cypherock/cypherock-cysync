import React, { ReactElement } from 'react';
import { Container, Flex, Typography } from '../../components';
// import sysync from "@assets/images/logo-small.png";
// import aside from "@assets/images/aside.png";
// import progress from "@assets/images/setPassProgress.png";
interface AsideProps {
  screenName: string;
}

export const Aside = ({ screenName }: AsideProps): ReactElement => (
  <Container
    variant="asideContainer"
    bgColor="sideBar"
    size="lg"
    direction="column"
    justify="between"
    align="center"
  >
    {/* <Image src={sysync} alignSelf="start"/> */}
    <Flex direction="column" align="center">
      {/* <Image src={aside} /> */}
    </Flex>
    <Flex direction="column" width="wFull" align="center">
      <Typography
        variant="h4"
        color="textSilver"
        width="wFull"
        textAlign="center"
        mb="mbThree"
      >
        {screenName}
      </Typography>
      {/* <Image src={progress} /> */}
    </Flex>
  </Container>
);
