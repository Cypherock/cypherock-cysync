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
  Flex,
  MainContainer,
} from "@/cysync-ui";
import arrowUp from "@/assets/images/main-app/arrowUp.png";
import arrowDown from "@/assets/images/main-app/arrowdown.png";
import update from "@/assets/images/main-app/update.png";
import banner from "@/assets/images/main-app/banner.png";

export const Portfolio = () => {
  return (
    <>
      <MainContainer
        contentGratient
        ptFour
        pbFour
        plTwo
        prTwo
        wFull
        border
        gap0
        column
      >
        <SnackBar update ptOne pbOne plTwo prTwo mbTwo justifyBetween>
          <SnackBarItem gapOne alignCenter>
            <Image src={update} />
            <HeadingSix mb0 fontSemiBold textGold>
              Update to cySync version 1.0.11 is available
            </HeadingSix>
          </SnackBarItem>
          <HeadingSix mb0 fontSemiBold textGold>
            Download update
          </HeadingSix>
        </SnackBar>

        <SnackBar banner ptTwo pbTwo plFive prFive mbTwo justifyBetween>
          <SnackBarItem alignCenter gapOne>
            <Image src={banner} />
            <HeadingSix mb0 textHeading>
              Manage your Metamask portfolio today through cySync App
            </HeadingSix>
          </SnackBarItem>

          <HeadingSix mb0 fontSemiBold textSilver>
            Know more
          </HeadingSix>
        </SnackBar>

        <DefaultContainer column gap0 wFull roundedTwo p0>
          <DefaultContainer
            sideBar
            ptTwo
            pbTwo
            plFive
            prFive
            column
            wFull
            roundedListTop
          >
            <HeadingFive textMuted fontSemiBold>
              Asset Allocation
            </HeadingFive>
          </DefaultContainer>

          <Divider />
          <UnOrderedList list ptTwo pbTwo plFive prFive wFull gapTwo>
            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>Asset</HeadingSix>

              <Flex column>
                <Image src={arrowUp} />
                <Image src={arrowDown} />
              </Flex>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>Price</HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>Amount</HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>Value</HeadingSix>
              <Image src={arrowUp} />
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>Allocation</HeadingSix>
              <Image src={arrowUp} />
            </ListItem>
          </UnOrderedList>
          <Divider />
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
            <ListItem w25 alignCenter justifyBetween>
              <Flex column>
                <HeadingSix textHeading fontBold mb0>
                  BTC
                </HeadingSix>
                <HeadingSix textHeading fontSemiBold mb0>
                  Bitcoin
                </HeadingSix>
              </Flex>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$ 16981.44</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>0.0178 BTC</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$2.9827</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$2.9827</HeadingSix>
            </ListItem>
          </UnOrderedList>
          <Divider />
          <UnOrderedList
            list
            ptTwo
            pbTwo
            plFive
            prFive
            wFull
            gapTwo
            alignCenter
          >
            <ListItem w25 alignCenter justifyBetween>
              <Flex column>
                <HeadingSix textHeading fontBold mb0>
                  BTC
                </HeadingSix>
                <HeadingSix textHeading fontSemiBold mb0>
                  Bitcoin
                </HeadingSix>
              </Flex>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$ 16981.44</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>0.0178 BTC</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$2.9827</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$2.9827</HeadingSix>
            </ListItem>
          </UnOrderedList>
          <Divider />
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
            <ListItem w25 alignCenter justifyBetween>
              <Flex column>
                <HeadingSix textHeading fontBold mb0>
                  BTC
                </HeadingSix>
                <HeadingSix textHeading fontSemiBold mb0>
                  Bitcoin
                </HeadingSix>
              </Flex>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$ 16981.44</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>0.0178 BTC</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$2.9827</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$2.9827</HeadingSix>
            </ListItem>
          </UnOrderedList>
          <Divider />
          <UnOrderedList
            list
            ptTwo
            pbTwo
            plFive
            prFive
            wFull
            gapTwo
            alignCenter
            roundedListBottom
          >
            <ListItem w25 alignCenter justifyBetween>
              <Flex column>
                <HeadingSix textHeading fontBold mb0>
                  BTC
                </HeadingSix>
                <HeadingSix textHeading fontSemiBold mb0>
                  Bitcoin
                </HeadingSix>
              </Flex>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$ 16981.44</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>0.0178 BTC</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$2.9827</HeadingSix>
            </ListItem>

            <ListItem w25 alignCenter justifyBetween>
              <HeadingSix textMuted>$2.9827</HeadingSix>
            </ListItem>
          </UnOrderedList>
        </DefaultContainer>
      </MainContainer>
    </>
  );
};
