import { useNavigate } from 'react-router-dom';
import React, { ReactElement, useEffect } from 'react';
import { Container, Flex, Typography } from '../../../components';
// import sysyncbig from '../../../assets/images/common/logo-big.png';

export const Splash = (): ReactElement => {
  // navigations
  const navigate = useNavigate();

  // effects
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/information');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container
      variant="container"
      bgColor="sideBar"
      size="lg"
      direction="column"
      justify="between"
      align="center"
    >
      <Flex direction="column" align="center">
        <Container
          bgColor="list"
          rounded="roundedFull"
          pb="pbFive"
          pl="plFive"
          pr="prFive"
          pt="ptFive"
          mb="mbThree"
        >
          {/* <Image src={sysyncbig} /> */}
        </Container>

        <Typography variant="h3" color="textGold" mb="mbSeven">
          cySync App
        </Typography>
        <Typography
          variant="h4"
          color="textSilver"
          font="fontMedium"
          mb="mbTwo"
        >
          Welcome to Cypherock
        </Typography>
        <Typography variant="h6" color="textMuted">
          Your Gateway to Self-Sovereignty
        </Typography>
        <Typography
          color="textMuted"
          textAlign="center"
          width="wFull"
          mt="mtThree"
        >
          ver 2. 314. 3094
        </Typography>
      </Flex>
    </Container>
  );
};
