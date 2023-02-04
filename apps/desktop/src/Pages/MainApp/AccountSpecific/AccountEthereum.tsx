import {
  Container,
  UnOrderedList,
  ListItem,
  Divider,
  Image,
  Flex,
  Button,
  HeadingFive,
  Typography,
} from "@/component";
import arrow from "@/assets/images/main-app/arrow.png";
import check from "@/assets/images/main-app/check.png";
import bitcoin from "@/assets/images/main-app/bitcoin.png";
import usdc from "@/assets/images/main-app/usdc.png";
import swapMuted from "@/assets/images/main-app/swap-muted.png";
import walletMuted from "@/assets/images/main-app/wallet-muted.png";
import buySell from "@/assets/images/main-app/buy-sell.png";
import show from "@/assets/images/main-app/show.png";
import arrowUp from "@/assets/images/main-app/arrowUp.png";
import arrowDown from "@/assets/images/main-app/arrowdown.png";
import eth from "@/assets/images/main-app/eth.png";
import rectangle from "@/assets/images/main-app/rectangle.png";
import transaction from "@/assets/images/main-app/transaction.png";
import trade from "@/assets/images/main-app/trade-gold.png";
import send from "@/assets/images/main-app/send-gold.png";
import receive from "@/assets/images/main-app/receive-gold.png";
import data from "./coins.json";

export const AccountEthereum = () => {
  return (
    <>
      <Container
        variant="mainContainer"
        bgColor="contentGratient"
        pt="ptFour"
        pb="pbFour"
        pr="prFour"
        pl="plFour"
        width="wFull"
        border
        gap0
        column
      >
        <Container mb="mbFive" alignCenter width="wFull" justifyBetween>
          <Flex alignCenter gapOne>
            <Image src={rectangle} />
            <Typography variant="h6" color="textMuted">
              Portfolio / /
            </Typography>
            <Image src={rectangle} />
            <Typography variant="h6" color="textMuted">
              Ethereum
            </Typography>
            <Image src={show} />
            <Typography variant="h6" color="textMuted">
              /
            </Typography>
            <Image src={rectangle} />
            <Typography variant="h6" color="textMuted">
              Ethereum 1
            </Typography>
            <Image src={show} />
          </Flex>

          <Flex gapOne>
            <Button variation="secondary">
              <Image src={trade} /> Trade
            </Button>
            <Button variation="secondary">
              <Image src={send} /> Send
            </Button>
            <Button variation="secondary">
              <Image src={receive} /> Receive
            </Button>
          </Flex>
        </Container>
        <Container column gap0 width="wFull" rounded="roundedTwo" mb="mbTwo">
          <UnOrderedList
            bgColor="list"
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            width="wFull"
            gapTwo
            justifyBetween
          >
            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Account
              </Typography>

              <Flex column>
                <Image src={arrowUp} />
                <Image src={arrowDown} />
              </Flex>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Wallet
              </Typography>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Amount
              </Typography>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Value
              </Typography>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Allocation
              </Typography>
              <Image src={arrowUp} />
            </ListItem>
          </UnOrderedList>
          <Divider />

          {data.map((coin, index) => {
            return (
              <>
                <UnOrderedList
                  key={index}
                  bgColor="contentGratient"
                  pt="ptTwo"
                  pb="pbTwo"
                  pl="plFive"
                  pr="prFive"
                  width="wFull"
                  gapTwo
                  alignCenter
                  justifyBetween
                >
                  <ListItem width="w25" alignCenter justifyBetween>
                    <Flex gapTwo alignCenter>
                      <Image src={eth} />
                      <Flex column>
                        <Typography variant="h6" color="textHeading">
                          {coin.coinName}
                        </Typography>
                        <Typography color="textMuted" font="fontNormal">
                          {coin.coin}
                        </Typography>
                      </Flex>
                    </Flex>
                  </ListItem>

                  <ListItem width="w25" alignCenter>
                    <Typography variant="h6" color="textMuted">
                      {coin.wallet}{" "}
                    </Typography>
                  </ListItem>

                  <ListItem width="w25" alignCenter>
                    <Typography variant="h6" color="textMuted">
                      ${coin.Amount}{" "}
                    </Typography>
                  </ListItem>

                  <ListItem width="w25" alignCenter justifyBetween>
                    <Typography variant="h6" color="textMuted">
                      ${coin.Amount}{" "}
                    </Typography>
                  </ListItem>

                  <ListItem width="w25" alignCenter justifyBetween>
                    <Typography variant="h6" color="textMuted">
                      ${coin.Value}{" "}
                    </Typography>
                  </ListItem>
                </UnOrderedList>
              </>
            );
          })}
        </Container>
        <Button variation="dashedBorder" width="wFull">
          <Flex justifyCenter gapOne>
            <Image src={transaction} />
            <Typography variant="h5" color="textMuted">
              Transactions
            </Typography>
          </Flex>
        </Button>
      </Container>
    </>
  );
};
