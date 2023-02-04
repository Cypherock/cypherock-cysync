import {
  Container,
  Typography,
  ListItem,
  UnOrderedList,
  Image,
  Flex,
  Divider,
  Tab,
} from "@/component";
import portfolio from "@/assets/images/main-app/portfolio.png";
import wallet from "@/assets/images/main-app/wallet.png";
import sendCrypto from "@/assets/images/main-app/sendCrypto.png";
import receiveCrypto from "@/assets/images/main-app/receiveCrypto.png";
import swap from "@/assets/images/main-app/swap.png";
import swapGold from "@/assets/images/main-app/swap-gold.png";
import history from "@/assets/images/main-app/history.png";
import settings from "@/assets/images/main-app/settings.png";
import more from "@/assets/images/main-app/more.png";
import exit from "@/assets/images/main-app/exit.png";
import cysync from "@/assets/images/main-app/cysync.png";
import support from "@/assets/images/main-app/support.png";
import historyGold from "@/assets/images/main-app/history-gold.png";
import walletGold from "@/assets/images/main-app/wallet-gold.png";
import { useNavigation } from "@/context/navigationContext";
import { ScreenTypes } from "@/enum";

export const Aside = () => {
  const { clickHandler, currentScreen } = useNavigation();
  return (
    <>
      <Container bgColor="black" alignCenter>
        <Container variant="asideContainer" column justifyBetween border>
          <UnOrderedList column width="wFull">
            <Flex alignCenter justifyBetween width="wFull" mb="mbFour">
              <Flex alignCenter gapTwo>
                <Image src={cysync} />
                <Typography color="textMuted" font="fontMedium">
                  cySync
                </Typography>
              </Flex>
              <Image src={exit} />
            </Flex>

            <Tab
              value={ScreenTypes.Portfolio}
              onClick={clickHandler}
              mb="mbFour"
            >
              <ListItem alignCenter gapTwo>
                {currentScreen === ScreenTypes.Portfolio ? (
                  <>
                    <Image src={portfolio} />
                    <Typography variant="h6" color="textGold" font="fontMedium">
                      Portfolio
                    </Typography>
                  </>
                ) : (
                  <>
                    <Image src={portfolio} />
                    <Typography
                      variant="h6"
                      color="textMuted"
                      font="fontMedium"
                    >
                      Portfolio
                    </Typography>
                  </>
                )}
              </ListItem>
            </Tab>

            <Tab
              value={ScreenTypes.Wallets}
              onClick={clickHandler}
              mb="mbFour"
              width="wFull"
            >
              <ListItem alignCenter justifyBetween width="wFull">
                <Flex alignCenter gapTwo>
                  {currentScreen === ScreenTypes.Wallets ? (
                    <>
                      <Image src={walletGold} />
                      <Typography
                        variant="h6"
                        color="textGold"
                        font="fontMedium"
                      >
                        Wallets
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Image src={wallet} />
                      <Typography
                        variant="h6"
                        color="textMuted"
                        font="fontMedium"
                      >
                        Wallets
                      </Typography>
                    </>
                  )}
                </Flex>
                <Image src={more} />
              </ListItem>
            </Tab>

            <Tab
              value={ScreenTypes.SendCrypto}
              onClick={clickHandler}
              mb="mbFour"
            >
              <ListItem alignCenter gapTwo>
                <Image src={sendCrypto} />

                {currentScreen === ScreenTypes.SendCrypto ? (
                  <>
                    <Typography variant="h6" color="textGold" font="fontMedium">
                      Send Crypto
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      color="textMuted"
                      font="fontMedium"
                    >
                      Send Crypto
                    </Typography>
                  </>
                )}
              </ListItem>
            </Tab>

            <Tab
              value={ScreenTypes.ReceiveCrypto}
              onClick={clickHandler}
              mb="mbFour"
            >
              <ListItem alignCenter gapTwo>
                <Image src={receiveCrypto} />
                {currentScreen === ScreenTypes.ReceiveCrypto ? (
                  <>
                    <Typography variant="h6" color="textGold" font="fontMedium">
                      Receive Crypto
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      color="textMuted"
                      font="fontMedium"
                    >
                      Receive Crypto
                    </Typography>
                  </>
                )}
              </ListItem>
            </Tab>

            <Tab value={ScreenTypes.Swap} onClick={clickHandler} mb="mbFour">
              <ListItem alignCenter gapTwo>
                {currentScreen === ScreenTypes.Swap ? (
                  <>
                    <Image src={swapGold} />
                    <Typography variant="h6" color="textGold" font="fontMedium">
                      Swap
                    </Typography>
                  </>
                ) : (
                  <>
                    <Image src={swap} />
                    <Typography
                      variant="h6"
                      color="textMuted"
                      font="fontMedium"
                    >
                      Swap
                    </Typography>
                  </>
                )}
              </ListItem>
            </Tab>

            <Tab value={ScreenTypes.History} onClick={clickHandler} mb="mbFour">
              <ListItem alignCenter gapTwo>
                {currentScreen === ScreenTypes.History ? (
                  <>
                    <Image src={historyGold} />
                    <Typography variant="h6" color="textGold" font="fontMedium">
                      History
                    </Typography>
                  </>
                ) : (
                  <>
                    <Image src={history} />
                    <Typography
                      variant="h6"
                      color="textMuted"
                      font="fontMedium"
                    >
                      History
                    </Typography>
                  </>
                )}
              </ListItem>
            </Tab>
          </UnOrderedList>

          <UnOrderedList column>
            <Tab
              value={ScreenTypes.Settings}
              onClick={clickHandler}
              mb="mbFour"
            >
              <ListItem alignCenter gapTwo>
                <Image src={settings} />
                <Typography variant="h6" color="textMuted" font="fontMedium">
                  Settings
                </Typography>
              </ListItem>
            </Tab>

            <Tab value={ScreenTypes.Help} onClick={clickHandler} mb="mbFour">
              <ListItem alignCenter gapTwo>
                <Image src={support} />
                <Typography variant="h6" color="textMuted" font="fontMedium">
                  Help
                </Typography>
              </ListItem>
            </Tab>
          </UnOrderedList>
        </Container>

        <Divider variant="vertical" rounded="roundedFull" />
      </Container>
    </>
  );
};
