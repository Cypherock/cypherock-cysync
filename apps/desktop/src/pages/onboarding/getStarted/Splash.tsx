import { Container, Flex, Typography, Image } from "@components";
import sysyncbig from "@assets/images/logo-big.png";
import { useEffect } from "react";
import { ONBOARDING_ROUTE_INFO } from "../../../routes/constantRoutePath";

export const Splash = ({onNext}: {
  onNext: () => void;
}): JSX.Element => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      variant="modalContainer"
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
          <Image src={sysyncbig} />
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
      </Flex>
      <Typography color="textMuted" textAlign="center" width="wFull" mt="mtThree">
        ver 2. 314. 3094
      </Typography>
    </Container>
  );
};
