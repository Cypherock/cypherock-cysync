import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxTopBar,
  Image,
  HeadingFive,
  HeadingSix,
  ListItem,
  HeadingSmallest,
  Divider,
  Flex,
  Button,
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

export const ShowMoreDialogue = () => {
  return (
    <DialogueBoxContainer lg>
      <DialogueBoxBody>
        <ListItem justifyBetween>
          <HeadingSix textMuted>Transaction Hash</HeadingSix>
          <HeadingSix textList>
            0x23ab56asd7nsd38242hfu23472634hdf893
          </HeadingSix>
        </ListItem>
        <Divider mbEight />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            Value
          </HeadingFive>
          <HeadingFive textList mb0>
            -$ 39.05
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            Fee
          </HeadingFive>
          <HeadingFive textList mb0>
            0.0004443 ETH = $ 0.569
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            Data
          </HeadingFive>
          <HeadingFive textList mb0>
            01/12/2022 4:37 PM
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            type
          </HeadingFive>
          <HeadingFive textList mb0>
            Sent
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            Status
          </HeadingFive>
          <HeadingFive textSuccess mb0>
            SUCCESS{" "}
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            Wallet
          </HeadingFive>
          <HeadingFive textList mb0>
            Cypherock Red
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            Account
          </HeadingFive>
          <HeadingFive textList mb0>
            {/* <Image src={eth} /> */}
            Ethereum Main
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            Asset
          </HeadingFive>
          <HeadingFive textList mb0>
            Ethereum
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbOne>
          <HeadingFive textMuted mb0>
            Sender
          </HeadingFive>
          <HeadingFive textGold mb0>
            0x23ab56asd7nsd38242hfu23472634hdf893
          </HeadingFive>
        </ListItem>
        <Divider mbOne />

        <ListItem justifyBetween mbFive>
          <HeadingFive textMuted mb0>
            Receiver
          </HeadingFive>
          <Flex column>
            <HeadingFive textMuted mb0>
              0x23ab56asd7nsd38242hfu23472634hdf893
            </HeadingFive>
            <HeadingFive textGold mb0>
              0x23ab56asd7nsd38242hfu23472634hdf893
            </HeadingFive>
          </Flex>
        </ListItem>
        <Button variation="Secondary">View on Explorer</Button>
      </DialogueBoxBody>
    </DialogueBoxContainer>
  );
};
