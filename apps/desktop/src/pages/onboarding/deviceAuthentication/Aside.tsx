import { Container, Image, Flex, Typography } from "@components";
import sysync from "@/assets/images/logo-small.png";
import aside from "@/assets/images/deviceAuth.png";
import progress from "@/assets/images/deciceAuthProgressbar.png";

export const Aside = () => {
  return (
      <Container
        variant="asideContainer"
        bgColor="sideBar"
        size="lg"
        direction="column"
        justify="between"
        align="center"
      >
        <Image src={sysync} alignSelf="start"/>
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
};
