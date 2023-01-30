import {
  ListItem,
  UnOrderedList,
  AsideContainer,
  HeadingFive,
  Image,
  HeadingSix,
  Flex,
  Divider,
  DefaultContainer,
  Tab,
} from "@/cysync-ui";
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
      <DefaultContainer p0 black alignCenter>
        <AsideContainer sideBar column justifyBetween border>
          <UnOrderedList column wFull>
            <Flex alignCenter justifyBetween wFull mbFour>
              <Flex alignCenter gapTwo>
                <Image src={cysync} />
                <HeadingFive textMuted fontMedium mb0>
                  cySync
                </HeadingFive>
              </Flex>
              <Image src={exit} />
            </Flex>

            <Tab value={ScreenTypes.Portfolio} onClick={clickHandler} mbFour>
              <ListItem alignCenter gapTwo>
                {currentScreen === ScreenTypes.Portfolio ? (
                  <>
                    <Image src={portfolio} />
                    <HeadingSix mb0 textGold fontMedium>
                      Portfolio
                    </HeadingSix>
                  </>
                ) : (
                  <>
                    <Image src={portfolio} />
                    <HeadingSix mb0 textMuted fontMedium>
                      Portfolio
                    </HeadingSix>
                  </>
                )}
              </ListItem>
            </Tab>

            <Tab
              value={ScreenTypes.Wallets}
              onClick={clickHandler}
              mbFour
              wFull
            >
              <ListItem alignCenter justifyBetween wFull>
                <Flex alignCenter gapTwo>
                  {currentScreen === ScreenTypes.Wallets ? (
                    <>
                      <Image src={walletGold} />
                      <HeadingSix mb0 textGold fontMedium>
                        Wallets
                      </HeadingSix>
                    </>
                  ) : (
                    <>
                      <Image src={wallet} />
                      <HeadingSix mb0 textMuted fontMedium>
                        Wallets
                      </HeadingSix>
                    </>
                  )}
                </Flex>
                <Image src={more} />
              </ListItem>
            </Tab>

            <Tab value={ScreenTypes.SendCrypto} onClick={clickHandler} mbFour>
              <ListItem alignCenter gapTwo>
                <Image src={sendCrypto} />

                {currentScreen === ScreenTypes.SendCrypto ? (
                  <>
                    <HeadingSix mb0 textGold fontMedium>
                      Send Crypto
                    </HeadingSix>
                  </>
                ) : (
                  <>
                    <HeadingSix mb0 textMuted fontMedium>
                      Send Crypto
                    </HeadingSix>
                  </>
                )}
              </ListItem>
            </Tab>

            <Tab
              value={ScreenTypes.ReceiveCrypto}
              onClick={clickHandler}
              mbFour
            >
              <ListItem alignCenter gapTwo>
                <Image src={receiveCrypto} />
                {currentScreen === ScreenTypes.ReceiveCrypto ? (
                  <>
                    <HeadingSix mb0 textGold fontMedium>
                      Receive Crypto
                    </HeadingSix>
                  </>
                ) : (
                  <>
                    <HeadingSix mb0 textMuted fontMedium>
                      Receive Crypto
                    </HeadingSix>
                  </>
                )}
              </ListItem>
            </Tab>

            <Tab value={ScreenTypes.Swap} onClick={clickHandler} mbFour>
              <ListItem alignCenter gapTwo>
                {currentScreen === ScreenTypes.Swap ? (
                  <>
                    <Image src={swapGold} />
                    <HeadingSix mb0 textGold fontMedium>
                      Swap
                    </HeadingSix>
                  </>
                ) : (
                  <>
                    <Image src={swap} />
                    <HeadingSix mb0 textMuted fontMedium>
                      Swap
                    </HeadingSix>
                  </>
                )}
              </ListItem>
            </Tab>

            <Tab value={ScreenTypes.History} onClick={clickHandler} mbFour>
              <ListItem alignCenter gapTwo>
                {currentScreen === ScreenTypes.History ? (
                  <>
                    <Image src={historyGold} />
                    <HeadingSix mb0 textGold fontMedium>
                      History
                    </HeadingSix>
                  </>
                ) : (
                  <>
                    <Image src={history} />
                    <HeadingSix mb0 textMuted fontMedium>
                      History
                    </HeadingSix>
                  </>
                )}
              </ListItem>
            </Tab>
          </UnOrderedList>

          <UnOrderedList column>
            <Tab value={ScreenTypes.Settings} onClick={clickHandler} mbFour>
              <ListItem alignCenter gapTwo>
                <Image src={settings} />
                <HeadingSix mb0 textMuted fontMedium>
                  Settings
                </HeadingSix>
              </ListItem>
            </Tab>

            <Tab value={ScreenTypes.Help} onClick={clickHandler} mbFour>
              <ListItem alignCenter gapTwo>
                <Image src={support} />
                <HeadingSix mb0 textMuted fontMedium>
                  Help
                </HeadingSix>
              </ListItem>
            </Tab>
          </UnOrderedList>
        </AsideContainer>

        <Divider verticalWhite roundedFull />
      </DefaultContainer>
    </>
  );
};
