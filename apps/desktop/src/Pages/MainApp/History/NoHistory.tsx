import {
  DefaultContainer,
  HeadingSix,
  Image,
  Button,
  HeadingFour,
  MainContainer,
} from "@/cysync-ui";
import noHistory from "@/assets/images/main-app/no-history.png";
import data from "./coins.json";

export const NoHistory = () => {
  console.log(data);
  return (
    <>
      <MainContainer
        contentGratient
        ptFour
        pbFour
        plFour
        prFour
        wFull
        border
        gap0
        column
        scroll
      >
        <DefaultContainer
          column
          gap0
          wFull
          roundedTwo
          ptFive
          pbFive
          mbTwo
          sideBar
          justifyCenter
          alignCenter
        >
          <Image src={noHistory} mbFive />
          <HeadingFour textHeading mbTwo>
            No transactions yet
          </HeadingFour>
          <HeadingSix textMuted mbFive>
            Receive Crypto today to see your transaction history here
          </HeadingSix>
          <Button variation="Primary">Receive</Button>
        </DefaultContainer>
      </MainContainer>
    </>
  );
};
