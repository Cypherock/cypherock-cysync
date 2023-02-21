import {
  Typography,
  Container,
  UnOrderedList,
  ListItem,
  Divider,
  Image,
  Flex,
  SearchBar,
  DropdownSelect,
  Chip,
} from "@components";
import bitcoin from "@/assets/images/main-app/bitcoin.png";
import usdc from "@/assets/images/main-app/usdc.png";
import arrow from "@/assets/images/main-app/arrow.png";
import check from "@/assets/images/main-app/check.png";
import rectangle from "@/assets/images/main-app/rectangle.png";
import eth from "@/assets/images/main-app/eth.png";
import arrowDown from "@/assets/images/main-app/arrowdown.png";
import arrowUp from "@/assets/images/main-app/arrowUp.png";
import swapMuted from "@/assets/images/main-app/swap-muted.png";
import transaction from "@/assets/images/main-app/transaction.png";
import walletMuted from "@/assets/images/main-app/wallet-muted.png";
import buySell from "@/assets/images/main-app/buy-sell.png";
import data from "./coins.json";

export const History = () => {
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
      >
        <Container mb="mbFive" alignCenter width="wFull" justifyBetween>
          <SearchBar />
        </Container>

        <Container column gap0 width="wFull" rounded="roundedTwo" mb="mbTwo">
          <Container
            borderRadiusOne
            bgColor="sideBar"
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            width="wFull"
            alignCenter
            gapTwo
          >
            <Flex gapTwo>
              <Chip>
                <Image src={transaction} />
                <Typography variant="h6" color="textMuted">
                  Transactions
                </Typography>
              </Chip>

              <Chip>
                <Image src={swapMuted} />
                <Typography variant="h6" color="textMuted">
                  Swap
                </Typography>
              </Chip>
              <Chip variation="active">
                <Image src={buySell} />
                <Typography variant="h6" color="textGold">
                  Buy/Sell
                </Typography>
              </Chip>
            </Flex>
          </Container>
          <Divider />

          <Container
            borderRadiusOne
            bgColor="sideBar"
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            width="wFull"
            alignCenter
            gapTwo
          >
            <Flex gapTwo>
              <DropdownSelect alignCenter justifyBetween>
                <Flex gapTwo>
                  <Image src={walletMuted} />
                  <Typography variant="h6" color="textMuted">
                    All Wallets
                  </Typography>
                </Flex>
                <Image src={arrowDown} />
              </DropdownSelect>

              <DropdownSelect alignCenter justifyBetween>
                textMuted
                <Typography variant="h6" color="textMuted">
                  All Accounts
                </Typography>
                <Image src={arrowDown} />
              </DropdownSelect>

              <DropdownSelect alignCenter justifyBetween>
                <Typography variant="h6" color="textMuted">
                  All Tokens
                </Typography>
                <Image src={arrowDown} />
              </DropdownSelect>
            </Flex>
          </Container>
          <Divider />

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
                Time
              </Typography>

              <Image src={arrowDown} />
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Wallet
              </Typography>

              <Image src={arrowUp} />
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Assets
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
                Status
              </Typography>

              <Image src={arrowUp} />
            </ListItem>
          </UnOrderedList>
          <Divider />

          <Container
            borderRadiusOne
            bgColor="sideBar"
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            width="wFull"
            alignCenter
            gapTwo
          >
            <Typography variant="h6" color="textHeading">
              11/12/2022
            </Typography>
          </Container>
          <Divider />

          {data.map((coin, index) => {
            return (
              <>
                {index % 2 == 0 ? (
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
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          {coin.wallet}
                        </Typography>
                      </ListItem>

                      <ListItem width="w25" alignCenter>
                        {" "}
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          {coin.wallet}
                        </Typography>
                      </ListItem>

                      <ListItem width="w25" alignCenter justifyBetween>
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          {coin.Amount}
                        </Typography>
                      </ListItem>

                      <ListItem width="w25" alignCenter justifyBetween>
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          {coin.Value}
                        </Typography>
                      </ListItem>

                      <ListItem width="w25" alignCenter justifyBetween>
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          SUCCESS
                        </Typography>
                      </ListItem>
                    </UnOrderedList>
                    <Divider />
                  </>
                ) : (
                  <>
                    <UnOrderedList
                      key={index}
                      bgColor="list"
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
                            <Typography
                              variant="h6"
                              color="textMuted"
                              font="fontNormal"
                            >
                              {coin.Amount}
                            </Typography>
                            <Typography color="textMuted" font="fontNormal">
                              {coin.coin}
                            </Typography>
                          </Flex>
                        </Flex>
                      </ListItem>

                      <ListItem width="w25" alignCenter>
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          {coin.wallet}
                        </Typography>
                      </ListItem>

                      <ListItem width="w25" alignCenter>
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          {coin.Amount}
                        </Typography>
                      </ListItem>

                      <ListItem width="w25" alignCenter justifyBetween>
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          {coin.Amount}
                        </Typography>
                      </ListItem>

                      <ListItem width="w25" alignCenter justifyBetween>
                        <Typography
                          variant="h6"
                          color="textMuted"
                          font="fontNormal"
                        >
                          {coin.Value}
                        </Typography>
                      </ListItem>

                      <ListItem width="w25" alignCenter justifyBetween>
                        <Typography color="textSuccess" font="fontNormal">
                          {coin.Amount}
                        </Typography>
                      </ListItem>
                    </UnOrderedList>
                    <Divider />
                  </>
                )}
              </>
            );
          })}
        </Container>
      </Container>
    </>
  );
};
