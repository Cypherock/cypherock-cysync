import { Container, Image, Flex, Typography } from "@/component";
import sysync from "@/assets/images/logo-small.png";
import aside from "@/assets/images/aside.png";
import progress from "@/assets/images/setPassProgress.png";

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
            variant="h4"
            color="textSilver"
            width="wFull"
            textAlign="center"
            mb="mbThree"
          >
            Set Password
          </Typography>
          <Image src={progress} />
        </Flex>
      </Container>
    </>
  );
};
