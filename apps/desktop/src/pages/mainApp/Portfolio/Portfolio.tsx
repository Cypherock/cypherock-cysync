import {
  Container,
  UnOrderedList,
  ListItem,
  Divider,
  Image,
  SnackBar,
  SnackBarItem,
  Flex,
  Typography,
} from "@components";
import arrowUp from "@/assets/images/main-app/arrowUp.png";
import arrowDown from "@/assets/images/main-app/arrowdown.png";
import update from "@/assets/images/main-app/update.png";
import banner from "@/assets/images/main-app/banner.png";

export const Portfolio = () => {
  return (
    <>
      <Container
        variant="mainContainer"
        bgColor="contentGratient"
        pt="ptFour"
        pb="pbFour"
        pl="plTwo"
        pr="prTwo"
        width="wFull"
        border
        gap0
        column
      >
        <SnackBar
          variant="update"
          pt="ptOne"
          pb="pbOne"
          pl="plTwo"
          pr="prTwo"
          mb="mbTwo"
          justifyBetween
        >
          <SnackBarItem gapOne alignCenter>
            <Image src={update} />
            <Typography variant="h6" font="fontSemiBold" color="textGold">
              Update to cySync version 1.0.11 is available
            </Typography>
          </SnackBarItem>
          <Typography variant="h6" font="fontSemiBold" color="textGold">
            Download update
          </Typography>
        </SnackBar>

        <SnackBar
          variant="banner"
          pt="ptTwo"
          pb="pbTwo"
          pl="plFive"
          pr="prFive"
          mb="mbTwo"
          justifyBetween
        >
          <SnackBarItem alignCenter gapOne>
            <Image src={banner} />
            <Typography variant="h6" color="textHeading">
              Manage your Metamask portfolio today through cySync App
            </Typography>
          </SnackBarItem>

          <Typography variant="h6" font="fontSemiBold" color="textSilver">
            Know more
          </Typography>
        </SnackBar>

        <Container column gap0 width="wFull" rounded="roundedTwo">
          <Container
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            column
            width="wFull"
            roundedListTop
          >
            <Typography variant="h5" color="textMuted" font="fontSemiBold">
              Asset Allocation
            </Typography>
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
          >
            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Asset
              </Typography>

              <Flex column>
                <Image src={arrowUp} />
                <Image src={arrowDown} />
              </Flex>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                Price
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
          <UnOrderedList
            bgColor="contentGratient"
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            width="wFull"
            gapTwo
            alignCenter
          >
            <ListItem width="w25" alignCenter justifyBetween>
              <Flex column>
                <Typography variant="h6" color="textHeading" font="fontBold">
                  BTC
                </Typography>
                <Typography
                  variant="h6"
                  color="textHeading"
                  font="fontSemiBold"
                >
                  Bitcoin
                </Typography>
              </Flex>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $ 16981.44
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                0.0178 BTC
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $2.9827
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $2.9827
              </Typography>
            </ListItem>
          </UnOrderedList>
          <Divider />
          <UnOrderedList
            bgColor="list"
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            width="wFull"
            gapTwo
            alignCenter
          >
            <ListItem width="w25" alignCenter justifyBetween>
              <Flex column>
                <Typography variant="h6" color="textHeading" font="fontBold">
                  BTC
                </Typography>
                <Typography
                  variant="h6"
                  color="textHeading"
                  font="fontSemiBold"
                >
                  Bitcoin
                </Typography>
              </Flex>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $ 16981.44
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                0.0178 BTC
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $2.9827
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $2.9827
              </Typography>
            </ListItem>
          </UnOrderedList>
          <Divider />
          <UnOrderedList
            bgColor="contentGratient"
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            width="wFull"
            gapTwo
            alignCenter
          >
            <ListItem width="w25" alignCenter justifyBetween>
              <Flex column>
                <Typography variant="h6" color="textHeading" font="fontBold">
                  BTC
                </Typography>
                <Typography
                  variant="h6"
                  color="textHeading"
                  font="fontSemiBold"
                >
                  Bitcoin
                </Typography>
              </Flex>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $ 16981.44
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                0.0178 BTC
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $2.9827
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $2.9827
              </Typography>
            </ListItem>
          </UnOrderedList>
          <Divider />
          <UnOrderedList
            bgColor="list"
            pt="ptTwo"
            pb="pbTwo"
            pl="plFive"
            pr="prFive"
            width="wFull"
            gapTwo
            alignCenter
            // roundedListBottom
          >
            <ListItem width="w25" alignCenter justifyBetween>
              <Flex column>
                <Typography variant="h6" color="textHeading" font="fontBold">
                  BTC
                </Typography>
                <Typography
                  variant="h6"
                  color="textHeading"
                  font="fontSemiBold"
                >
                  Bitcoin
                </Typography>
              </Flex>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $ 16981.44
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                0.0178 BTC
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $2.9827
              </Typography>
            </ListItem>

            <ListItem width="w25" alignCenter justifyBetween>
              <Typography variant="h6" color="textMuted">
                $2.9827
              </Typography>
            </ListItem>
          </UnOrderedList>
        </Container>
      </Container>
    </>
  );
};
