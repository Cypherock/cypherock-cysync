import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
  UniSwapLogo,
  Image,
  AlertBox,
  BulletList,
  Flex,
  Divider,
  EthereumIcon,
  SvgProps,
  PolygonIcon,
  ScrollableContainer,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useWalletConnectDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';

interface ConnectAccountParam {
  name: string;
  balanceUnit: string;
  icon: React.FC<SvgProps>;
  accounts: {
    name: string;
    address: string;
    balance: number;
  }[];
}

const maskAddress = (address: string, len = 12) =>
  `${address.slice(0, len)}...${address.slice(-len)}`;

const ConnectAccounts: React.FC<ConnectAccountParam> = ({
  icon: Icon,
  name,
  accounts,
  balanceUnit,
}) => (
  <Container direction="column" gap={8} align="stretch">
    <Typography>
      <LangDisplay text={name} />
    </Typography>
    {accounts.map(account => (
      <Flex
        key={account.name}
        direction="row"
        justify="space-between"
        gap={24}
        py={2}
        px={3}
        $borderRadius={8}
        $borderWidth={1}
      >
        <Flex gap={16}>
          <Icon />
          <Flex direction="column">
            <Typography>
              <LangDisplay text={account.name} />
            </Typography>
            <Typography>
              <LangDisplay text={maskAddress(account.address)} />
            </Typography>
          </Flex>
        </Flex>
        <Typography>
          <LangDisplay text={`${account.balance} ${balanceUnit}`} />
        </Typography>
      </Flex>
    ))}
  </Container>
);

export const WalletConnectAccountConnectedDialog: React.FC = () => {
  const { onClose } = useWalletConnectDialog();
  const lang = useAppSelector(selectLanguage);
  const { buttons, walletConnect } = lang.strings;
  const { accountConnectedTab, common } = walletConnect;

  const { selectedWallet } = useWalletConnectDialog();

  const data: Record<string, ConnectAccountParam> = {
    ethereum: {
      balanceUnit: 'ETH',
      name: 'Ethereum',
      icon: EthereumIcon,
      accounts: [
        {
          name: 'Ethereum 1',
          address: '0xe1b5847324b3D94816866957de7cB12E05ce36C0',
          balance: 0.015,
        },
        {
          name: 'Ethereum 2',
          address: '0x1DB9c7d05cbb947c685A7eE7bF21e0c32aA76F7c',
          balance: 0.203,
        },
      ],
    },
    polygon: {
      balanceUnit: 'MATIC',
      name: 'Polygon',
      icon: PolygonIcon,
      accounts: [
        {
          name: 'Ethereum 1',
          address: '0x02F65f96F2DAAFEAC8FE5d1aDB116840132EcF26',
          balance: 68.56,
        },
        {
          name: 'Ethereum 2',
          address: '0x3Ca2d5b526c172D3beA81D156a42B59DD7173561',
          balance: 300.5,
        },
      ],
    },
  };

  return (
    <ScrollableContainer $maxHeight="90vh">
      <DialogBox width={500}>
        <DialogBoxBody pt={4} pb={4} px={0}>
          <Container display="flex" direction="column" gap={32} py={4} px={5}>
            <Image src={UniSwapLogo} alt="Send Coin" />
            <Container display="flex" direction="column" gap={8} width="full">
              <Typography variant="h5" $textAlign="center">
                <LangDisplay text="Connect to Uniswap interface" />
              </Typography>
              <Typography variant="span" color="muted">
                <LangDisplay text="app.uniswap.org" />
              </Typography>
            </Container>
          </Container>
          <Divider variant="horizontal" />
          <Container px={5} direction="column" align="stretch" gap={24}>
            <Flex justify="space-between">
              <Typography>
                <LangDisplay text={accountConnectedTab.title} />
              </Typography>
              <Typography>
                <LangDisplay
                  text={selectedWallet?.name ?? 'No Wallet Selected'}
                />
              </Typography>
            </Flex>
            <ConnectAccounts {...data.ethereum} />
            <ConnectAccounts {...data.polygon} />
          </Container>
          <Container
            display="flex"
            direction="column"
            gap={24}
            py={2}
            px={5}
            width="full"
          >
            <Typography>
              <LangDisplay text={common.info.title} />
            </Typography>
            <BulletList items={common.info.points} />
          </Container>
          <Divider variant="horizontal" />
          <Container px={5}>
            <AlertBox alert={accountConnectedTab.info} variant="warning" />
          </Container>
        </DialogBoxBody>
        <DialogBoxFooter>
          <Button
            variant="primary"
            disabled={false}
            onClick={e => {
              e.preventDefault();
              onClose();
            }}
          >
            <LangDisplay text={buttons.disconnect} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </ScrollableContainer>
  );
};
