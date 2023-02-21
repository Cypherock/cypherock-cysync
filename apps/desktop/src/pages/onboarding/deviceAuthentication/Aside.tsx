import { Container, Image, Flex, Typography } from "@/component";
import sysync from "@/assets/images/logo-small.png";
import aside from "@/assets/images/deviceAuth.png";
import progress from "@/assets/images/deciceAuthProgressbar.png";

export const Aside = () => {
  return (
    <>
      <Container
        variant="asideContainer"
        bgColor="sideBar"
        size="lg"
        column
        justifyBetween
      >
        <Image src={sysync} />
        <Flex column alignCenter>
          <Image src={aside} />
        </Flex>
        <Flex column width="wFull" alignCenter>
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
    </>
  );
};
