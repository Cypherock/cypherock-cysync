import {
  DefaultContainer,
  HeadingFive,
  UnOrderedList,
  ListItem,
  HeadingSix,
  Divider,
  Image,
  SnackBar,
  SnackBarItem,
  InputContainer,
  Flex,
  Button,
  InputLabel,
  Input,
  HeadingSmallest,
  Badge,
  BadgeTypography,
  SearchBar,
  MainContainer,
} from "@components";
import arrowUp from "@/assets/images/main-app/arrowUp.png";
import arrowDown from "@/assets/images/main-app/arrowdown.png";
import bitcoin from "@/assets/images/main-app/bitcoin.png";
import usdc from "@/assets/images/main-app/usdc.png";
import eth from "@/assets/images/main-app/eth.png";
import arrow from "@/assets/images/main-app/arrow.png";
import check from "@/assets/images/main-app/check.png";
import rectangle from "@/assets/images/main-app/rectangle.png";
import data from "./coins.json";

export const Wallet = () => {
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
        <DefaultContainer mbFive alignCenter wFull justifyBetween>
          <Flex alignCenter gapOne>
            <Image src={rectangle} />
            <HeadingSix textMuted mb0>
              Wallets /
            </HeadingSix>
            <Image src={rectangle} />
            <HeadingSix textHeading mb0>
              Cypherock Red
            </HeadingSix>
          </Flex>

          <Button variation="Primary">Add Coin/Account</Button>
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
            <HeadingFive textMuted fontMedium mb0>
              Accounts
            </HeadingFive>

            {/* <InputContainer>
              <InputLabel></InputLabel> <Input placeholder="Search" />
            </InputContainer> */}

            <SearchBar placeholder="Search" />
          </DefaultContainer>
          <Divider />

          <UnOrderedList list ptTwo pbTwo plFive prFive wFull gapTwo>
            <ListItem w35 alignCenter justifyBetween>
              <HeadingSix textMuted>Account</HeadingSix>

              <Flex column>
                <Image src={arrowUp} />
                <Image src={arrowDown} />
              </Flex>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>Wallet</HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w15 alignCenter justifyCenter>
              <HeadingSix textMuted>Sync Status</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>Amount</HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>Value</HeadingSix>
              <Image src={arrowUp} />
            </ListItem>
          </UnOrderedList>

          {data.map((coin, index) => {
            return (
              <>
                {index % 2 == 0 ? (
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
                  >
                    <ListItem w35 alignCenter justifyBetween>
                      <Flex gapTwo alignCenter>
                        <Image src={eth} />
                        <Flex column>
                          <HeadingSix textHeading mb0>
                            {coin.coinName}
                          </HeadingSix>
                          <Flex gapOne>
                            <HeadingSmallest textMuted fontMedium mb0>
                              {coin.coin}
                            </HeadingSmallest>
                            <Badge>
                              <BadgeTypography>NATIVE SEGWIT</BadgeTypography>
                            </Badge>
                          </Flex>
                        </Flex>
                      </Flex>
                    </ListItem>

                    <ListItem w25 alignCenter justifyBetween>
                      <HeadingSix textMuted>{coin.wallet}</HeadingSix>
                    </ListItem>

                    <ListItem w15 alignCenter justifyCenter>
                      <Image src={check} />
                    </ListItem>

                    <ListItem w25 alignCenter justifyBetween>
                      <HeadingSix textMuted>${coin.Amount}</HeadingSix>
                    </ListItem>

                    <ListItem w25 alignCenter justifyBetween>
                      <HeadingSix textMuted>${coin.Value}</HeadingSix>
                    </ListItem>
                  </UnOrderedList>
                ) : (
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
                  >
                    <ListItem w35 alignCenter justifyBetween>
                      <Flex gapTwo alignCenter>
                        <Image src={eth} />
                        <Flex column>
                          <HeadingSix textHeading mb0>
                            {coin.coinName}
                          </HeadingSix>
                          <Flex gapOne>
                            <HeadingSmallest textMuted fontMedium mb0>
                              {coin.coin}
                            </HeadingSmallest>
                            <Badge>
                              <BadgeTypography>NATIVE SEGWIT</BadgeTypography>
                            </Badge>
                          </Flex>
                        </Flex>
                      </Flex>
                    </ListItem>

                    <ListItem w25 alignCenter justifyBetween>
                      <HeadingSix textMuted>{coin.wallet}</HeadingSix>
                    </ListItem>

                    <ListItem w15 alignCenter justifyCenter>
                      <Image src={check} />
                    </ListItem>

                    <ListItem w25 alignCenter justifyBetween>
                      <HeadingSix textMuted>${coin.Amount}</HeadingSix>
                    </ListItem>

                    <ListItem w25 alignCenter justifyBetween>
                      <HeadingSix textMuted>${coin.Value}</HeadingSix>
                    </ListItem>
                  </UnOrderedList>
                )}

                {coin.subCoinList ? "" : <Divider />}

                {coin.subCoinList
                  ? coin.subCoinList.map((subCoinList, index, { length }) => {
                      return (
                        <>
                          <UnOrderedList
                            contentGratient
                            ptTwo
                            pbTwo
                            plFive
                            prFive
                            wFull
                            gapTwo
                            alignCenter
                          >
                            <ListItem w35 alignCenter gapTwo>
                              {index == 0 ? (
                                <Image src={arrow} plThree />
                              ) : (
                                <Image src="" plFive />
                              )}
                              <Image src={usdc} />
                              <HeadingSix textMuted mb0>
                                {subCoinList.coinName}
                              </HeadingSix>
                            </ListItem>

                            <ListItem w25 alignCenter justifyBetween>
                              <HeadingSix textMuted></HeadingSix>
                            </ListItem>

                            <ListItem w15 alignCenter justifyCenter>
                              {/* <Image src={check} /> */}
                            </ListItem>

                            <ListItem w25 alignCenter justifyBetween>
                              <HeadingSix textMuted>$2.9827</HeadingSix>
                            </ListItem>

                            <ListItem w25 alignCenter justifyBetween>
                              <HeadingSix textMuted>$2.9827</HeadingSix>
                            </ListItem>
                          </UnOrderedList>
                          {index + 1 === length ? (
                            <>
                              <UnOrderedList wFull justifyCenter ptOne pbTwo>
                                <ListItem>
                                  <HeadingSmallest textHeading>
                                    Hide tokens ({length})
                                  </HeadingSmallest>
                                </ListItem>
                              </UnOrderedList>
                              <Divider />
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      );
                    })
                  : ""}
              </>
            );
          })}
        </DefaultContainer>
        <Button DashedBorder wFull>
          <HeadingFive textMuted mb0>
            Show transaction details
          </HeadingFive>
        </Button>
      </MainContainer>
    </>
  );
};
