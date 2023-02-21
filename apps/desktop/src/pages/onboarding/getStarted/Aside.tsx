import { Container, Flex, Typography, Image } from "@components";
import sysync from "@/assets/images/logo-small.png";
import { Link } from "react-router-dom";

export const Aside = (): JSX.Element => {
  return (
    <Container
      variant="asideContainer"
      bgColor="sideBar"
      size="lg"
      column
      justifyBetween
    >
      <Image src={sysync} />
      <Flex column alignCenter>
        <Container
          bgColor="list"
          rounded="roundedFull"
          pb="pbFive"
          pl="plFive"
          pr="prFive"
          pt="ptFive"
          mb="mbThree"
        >
          <Image src={sysync} />
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
      <Typography color="textMuted" textAlign="center" width="wFull">
        ver 2. 314. 3094
      </Typography>
    </Container>
  );
};
