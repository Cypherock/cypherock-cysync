import {
  DefaultContainer,
  UnOrderedList,
  ListItem,
  HeadingSix,
  Divider,
  Image,
  Flex,
  HeadingSmallest,
  Button,
  HeadingFive,
  MainContainer,
} from "@/cysync-ui";
import arrowUp from "@/assets/images/main-app/arrowUp.png";
import arrowDown from "@/assets/images/main-app/arrowdown.png";
import bitcoin from "@/assets/images/main-app/bitcoin.png";
import usdc from "@/assets/images/main-app/usdc.png";
import eth from "@/assets/images/main-app/eth.png";
import show from "@/assets/images/main-app/show.png";
import arrow from "@/assets/images/main-app/arrow.png";
import check from "@/assets/images/main-app/check.png";
import rectangle from "@/assets/images/main-app/rectangle.png";
import swapMuted from "@/assets/images/main-app/swap-muted.png";
import transaction from "@/assets/images/main-app/transaction.png";
import walletMuted from "@/assets/images/main-app/wallet-muted.png";
import buySell from "@/assets/images/main-app/buy-sell.png";
import trade from "@/assets/images/main-app/trade-gold.png";
import send from "@/assets/images/main-app/send-gold.png";
import receive from "@/assets/images/main-app/receive-gold.png";
import data from "./coins.json";

export const CoinEthereum = () => {
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
            <Image src={show} />
          </Flex>

          <Flex gapOne>
            <Button variation="Secondary">
              <Image src={trade} /> Trade
            </Button>
            <Button variation="Secondary">
              <Image src={send} /> Send
            </Button>
            <Button variation="Secondary">
              <Image src={receive} /> Receive
            </Button>
          </Flex>
        </DefaultContainer>
        <DefaultContainer column gap0 wFull roundedTwo p0 mbTwo>
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
            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Account
              </HeadingSix>

              <Flex column>
                <Image src={arrowUp} />
                <Image src={arrowDown} />
              </Flex>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Wallet
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Amount
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Value
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted mb0>
                Allocation
              </HeadingSix>
              <Image src={arrowUp} />
            </ListItem>
          </UnOrderedList>
          <Divider />

          {data.map((coin, index) => {
            return (
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
                  <ListItem w25 alignCenter justifyBetween>
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

                  <ListItem w25 alignCenter>
                    <HeadingSix textMuted>{coin.wallet}</HeadingSix>
                  </ListItem>

                  <ListItem w25 alignCenter>
                    <HeadingSix textMuted>${coin.Amount}</HeadingSix>
                  </ListItem>

                  <ListItem w25 alignCenter justifyBetween>
                    <HeadingSix textMuted>${coin.Amount}</HeadingSix>
                  </ListItem>

                  <ListItem w25 alignCenter justifyBetween>
                    <HeadingSix textMuted>${coin.Value}</HeadingSix>
                  </ListItem>
                </UnOrderedList>
              </>
            );
          })}
        </DefaultContainer>
        <Button DashedBorder wFull>
          <Flex justifyCenter gapOne>
            <Image src={transaction} />
            <HeadingFive textMuted mb0>
              Transactions
            </HeadingFive>
          </Flex>
        </Button>
      </MainContainer>
    </>
  );
};
