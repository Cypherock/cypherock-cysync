import {
  Container,
  DialogueBoxBody,
  ListItem,
  Divider,
  Flex,
  Button,
  Typography,
} from "@components";
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
    <Container>
      <DialogueBoxBody>
        <ListItem justifyBetween>
          <Typography variant="h6" color="textMuted">
            Transaction Hash
          </Typography>
          <Typography variant="h6" color="textList">
            0x23ab56asd7nsd38242hfu23472634hdf893
          </Typography>
        </ListItem>
        <Divider mb="mbEight" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            Value
          </Typography>
          <Typography variant="h5" color="textList">
            -$ 39.05
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            Fee
          </Typography>
          <Typography variant="h5" color="textList">
            0.0004443 ETH = $ 0.569
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            Data
          </Typography>
          <Typography variant="h5" color="textList">
            01/12/2022 4:37 PM
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            type
          </Typography>
          <Typography variant="h5" color="textList">
            Sent
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            Status
          </Typography>
          <Typography variant="h5" color="textSuccess">
            SUCCESS
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            Wallet
          </Typography>
          <Typography variant="h5" color="textList">
            Cypherock Red
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            Account
          </Typography>
          <Typography variant="h5" color="textList">
            Ethereum Main
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            Asset
          </Typography>
          <Typography variant="h5" color="textList">
            Ethereum
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbOne">
          <Typography variant="h5" color="textMuted">
            Sender
          </Typography>

          <Typography variant="h5" color="textGold">
            0x23ab56asd7nsd38242hfu23472634hdf893
          </Typography>
        </ListItem>
        <Divider mb="mbOne" />

        <ListItem justifyBetween mb="mbFive">
          <Flex>
            <Typography variant="h5" color="textMuted">
              Receiver
            </Typography>
            <Typography variant="h5" color="textMuted">
              0x23ab56asd7nsd38242hfu23472634hdf893
            </Typography>
            <Typography variant="h5" color="textGold">
              0x23ab56asd7nsd38242hfu23472634hdf893
            </Typography>
          </Flex>
        </ListItem>
        <Button variation="secondary">View on Explorer</Button>
      </DialogueBoxBody>
    </Container>
  );
};
