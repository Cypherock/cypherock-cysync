import {
  DefaultContainer,
  HeadingFive,
  UnOrderedList,
  ListItem,
  HeadingSix,
  Divider,
  Image,
  InputContainer,
  Flex,
  Button,
  InputLabel,
  Input,
  HeadingSmallest,
  Badge,
  BadgeTypography,
  SearchBar,
  DropdownSelect,
  Chip,
  MainContainer,
} from "@/cysync-ui";
import arrowUp from "@/assets/images/main-app/arrowUp.png";
import arrowDown from "@/assets/images/main-app/arrowdown.png";
import bitcoin from "@/assets/images/main-app/bitcoin.png";
import usdc from "@/assets/images/main-app/usdc.png";
import eth from "@/assets/images/main-app/eth.png";
import arrow from "@/assets/images/main-app/arrow.png";
import check from "@/assets/images/main-app/check.png";
import rectangle from "@/assets/images/main-app/rectangle.png";
import swapMuted from "@/assets/images/main-app/swap-muted.png";
import transaction from "@/assets/images/main-app/transaction.png";
import walletMuted from "@/assets/images/main-app/wallet-muted.png";
import buySell from "@/assets/images/main-app/buy-sell.png";
import data from "./coins.json";

export const History = () => {
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
      >
        <DefaultContainer mbFive alignCenter wFull justifyBetween>
          <SearchBar />
        </DefaultContainer>

        <DefaultContainer column gap0 wFull roundedTwo p0 mbTwo>
          <DefaultContainer
            borderRadiusOne
            sideBar
            ptTwo
            pbTwo
            plFive
            prFive
            wFull
            alignCenter
            gapTwo
          >
            <Flex gapTwo>
              <Chip>
                <Image src={transaction} />
                <HeadingSix mb0 textMuted>
                  Transactions
                </HeadingSix>
              </Chip>

              <Chip>
                <Image src={swapMuted} />
                <HeadingSix mb0 textMuted>
                  Swap
                </HeadingSix>
              </Chip>
              <Chip variation="active">
                <Image src={buySell} />
                <HeadingSix mb0 textGold>
                  Buy/Sell
                </HeadingSix>
              </Chip>
            </Flex>
          </DefaultContainer>
          <Divider />

          <DefaultContainer
            borderRadiusOne
            sideBar
            ptTwo
            pbTwo
            plFive
            prFive
            wFull
            alignCenter
            gapTwo
          >
            <Flex gapTwo>
              <DropdownSelect alignCenter justifyBetween>
                <Flex gapTwo>
                  <Image src={walletMuted} />
                  <HeadingSix mb0 textMuted>
                    All Wallets
                  </HeadingSix>
                </Flex>
                <Image src={arrowDown} />
              </DropdownSelect>

              <DropdownSelect alignCenter justifyBetween>
                <HeadingSix mb0 textMuted>
                  All Accounts
                </HeadingSix>
                <Image src={arrowDown} />
              </DropdownSelect>

              <DropdownSelect alignCenter justifyBetween>
                <HeadingSix mb0 textMuted>
                  All Tokens
                </HeadingSix>
                <Image src={arrowDown} />
              </DropdownSelect>
            </Flex>
          </DefaultContainer>
          <Divider />

          <UnOrderedList
            list
            ptTwo
            pbTwo
            plFive
            prFive
            wFull
            gapTwo
            justifyBetween
          >
            <ListItem w15 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Time
              </HeadingSix>

              <Image src={arrowDown} />
            </ListItem>

            <ListItem w15 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Wallet
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w15 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Assets
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w15 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Amount
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w15 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Value
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w15 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Status
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>
          </UnOrderedList>
          <Divider />

          <DefaultContainer
            borderRadiusOne
            sideBar
            ptTwo
            pbTwo
            plFive
            prFive
            wFull
            alignCenter
            gapTwo
          >
            <HeadingSix textHeading mb0>
              11/12/2022
            </HeadingSix>
          </DefaultContainer>
          <Divider />

          {data.map((coin, index) => {
            return (
              <>
                {index % 2 == 0 ? (
                  <>
                    <UnOrderedList
                      key={index}
                      contentGratient
                      ptTwo
                      pbTwo
                      plFive
                      prFive
                      wFull
                      gapTwo
                      alignCenter
                      justifyBetween
                    >
                      <ListItem w15 alignCenter justifyBetween>
                        <Flex gapTwo alignCenter>
                          <Image src={eth} />
                          <Flex column>
                            <HeadingSix textHeading mb0>
                              {coin.coinName}
                            </HeadingSix>
                            <HeadingSmallest textMuted fontNormal mb0>
                              {coin.coin}
                            </HeadingSmallest>
                          </Flex>
                        </Flex>
                      </ListItem>

                      <ListItem w15 alignCenter>
                        <HeadingSix textMuted>{coin.wallet}</HeadingSix>
                      </ListItem>

                      <ListItem w15 alignCenter>
                        <HeadingSix textMuted>${coin.Amount}</HeadingSix>
                      </ListItem>

                      <ListItem w15 alignCenter justifyBetween>
                        <HeadingSix textMuted>${coin.Amount}</HeadingSix>
                      </ListItem>

                      <ListItem w15 alignCenter justifyBetween>
                        <HeadingSix textMuted>${coin.Value}</HeadingSix>
                      </ListItem>

                      <ListItem w15 alignCenter justifyBetween>
                        <HeadingSix textSuccess>SUCCESS</HeadingSix>
                      </ListItem>
                    </UnOrderedList>
                    <Divider />
                  </>
                ) : (
                  <>
                    <UnOrderedList
                      key={index}
                      list
                      ptTwo
                      pbTwo
                      plFive
                      prFive
                      wFull
                      gapTwo
                      alignCenter
                      justifyBetween
                    >
                      <ListItem w15 alignCenter justifyBetween>
                        <Flex gapTwo alignCenter>
                          <Image src={eth} />
                          <Flex column>
                            <HeadingSix textHeading mb0>
                              {coin.coinName}
                            </HeadingSix>
                            <HeadingSmallest textMuted fontNormal mb0>
                              {coin.coin}
                            </HeadingSmallest>
                          </Flex>
                        </Flex>
                      </ListItem>

                      <ListItem w15 alignCenter>
                        <HeadingSix textMuted>{coin.wallet}</HeadingSix>
                      </ListItem>

                      <ListItem w15 alignCenter>
                        <HeadingSix textMuted>${coin.Amount}</HeadingSix>
                      </ListItem>

                      <ListItem w15 alignCenter justifyBetween>
                        <HeadingSix textMuted>${coin.Amount}</HeadingSix>
                      </ListItem>

                      <ListItem w15 alignCenter justifyBetween>
                        <HeadingSix textMuted>${coin.Value}</HeadingSix>
                      </ListItem>

                      <ListItem w15 alignCenter justifyBetween>
                        <HeadingSix textSuccess>SUCCESS</HeadingSix>
                      </ListItem>
                    </UnOrderedList>
                    <Divider />
                  </>
                )}
              </>
            );
          })}
        </DefaultContainer>
      </MainContainer>
    </>
  );
};
