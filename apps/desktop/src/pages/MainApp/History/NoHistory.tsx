import { Typography, Container, Image, Button } from "@/component";
import noHistory from "@/assets/images/main-app/no-history.png";
import data from "./coins.json";

export const NoHistory = () => {
  console.log(data);
  return (
    <>
      <Container
        variant="mainContainer"
        bgColor="contentGratient"
        pt="ptFour"
        pb="pbFour"
        pl="plFour"
        pr="prFour"
        width="wFull"
        border
        gap0
        column
        scroll
      >
        <Container
          column
          gap0
          width="wFull"
          rounded="roundedTwo"
          pt="ptFive"
          pb="pbFive"
          mb="mbTwo"
          justifyCenter
          alignCenter
        >
          <Image src={noHistory} mb="mbFive" />
          <Typography variant="h4" color="textHeading" mb="mbTwo">
            No transactions yet
          </Typography>
          <Typography variant="h5" color="textMuted" mb="mbFive">
            Receive Crypto today to see your transaction history here
          </Typography>
          <Button variation="primary">Receive</Button>
        </Container>
      </Container>
    </>
  );
};
