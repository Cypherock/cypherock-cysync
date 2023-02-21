import { ListItem, UnOrderedList, Container, Flex } from "@/component";
import { Aside } from "./Aside/Aside";
import { TopBar } from "./TopBar/TopBar";
import { Portfolio } from "./Portfolio/Portfolio";
import { Wallet } from "./Wallet/Wallet";
import { History } from "./History/History";
import { NoHistory } from "./History/NoHistory";
import { ShowMoreDialogue } from "./History/ShowMoreDialogue";
import { CoinEthereum } from "./CoinSpecific/CoinEthereum";
import { AccountEthereum } from "./AccountSpecific/AccountEthereum";
import { useNavigation } from "@/context/navigationContext";
import { ScreenTypes } from "@/enum";

export const MainApp = () => {
  // const { currentScreen } = useNavigation();
  // console.log(currentScreen);
  return (
    <>
      <Flex>
        <Aside />
        <Flex direction="column" width="wFull">
          <TopBar />

          {currentScreen === ScreenTypes.Portfolio ? <Portfolio /> : ""}
          {currentScreen === ScreenTypes.History ? <History /> : ""}
          {currentScreen === ScreenTypes.Wallets ? <Wallet /> : ""}
        </Flex>
      </Flex>
    </>
  );
};
