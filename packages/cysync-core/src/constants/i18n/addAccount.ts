import {
  bitcoinIcon,
  bnbChainIcon,
  checkIcon,
  etheriumBlueIcon,
  halfLoaderGold,
} from '@cypherock/cysync-ui';

const addAccount = {
  addAccount: {
    initAccount: {
      info: {
        dialogBox: {
          title: 'Add Coin/Account',
          header: 'Follow instructions on the X1 Vault',
          subheader: 'Add a coin/account Wallet',
          subheader1: 'Cypherock Red',
          dataArray: [
            {
              id: '1', // Add a unique identifier to each data object
              leftImageSrc: bnbChainIcon,
              text: 'BNB Chain 1',
              rightImageSrc: checkIcon,
            },
            {
              id: '2',
              leftImageSrc: bitcoinIcon,
              // rightText: '0.77 ETH',
              text: 'Bitcoin 1',
              rightImageSrc: halfLoaderGold,
            },
            {
              id: '3',
              leftImageSrc: etheriumBlueIcon,
              text: 'Etherium 3',
            },
          ],
        },
      },
    },
    syncAccount: {
      info: {
        dialogBox: {
          title: 'Add Coin/Account',
          header: 'Syncing the account',
          subheader: 'Accounts already in portfolio',
          end: 'Stop Syncing',
          dataArray: [
            {
              id: '21', // Add a unique identifier to each data object
              leftImageSrc: etheriumBlueIcon,
              rightText: '2.35 ETH',
              text: 'Etherium 1',
            },
            {
              id: '22',
              leftImageSrc: etheriumBlueIcon,
              rightText: '0.77 ETH',
              text: 'Etherium 2',
            },
            {
              id: '23',
              leftImageSrc: etheriumBlueIcon,
              rightText: '0.08 ETH',
              text: 'Etherium 3',
            },
          ],
        },
      },
    },
    noAccount: {
      info: {
        dialogBox: {
          title: 'Add Coin/Account',
          header: 'No account found yet',
          subheader: 'Accounts already in portfolio',
          dataArray: [
            {
              id: '21', // Add a unique identifier to each data object
              leftImageSrc: etheriumBlueIcon,
              rightText: '2.35 ETH',
              text: 'Etherium 1',
            },
            {
              id: '22',
              leftImageSrc: etheriumBlueIcon,
              rightText: '0.77 ETH',
              text: 'Etherium 2',
            },
            {
              id: '23',
              leftImageSrc: etheriumBlueIcon,
              rightText: '0.08 ETH',
              text: 'Etherium 3',
            },
          ],
        },
      },
    },
    add: {
      info: {
        dialogBox: {
          title: 'Add Coin/Account',
          header: 'Add new accounts',
          subheader: 'New Accounts',
          submitButton: 'Add Accounts',
          advanced: 'Advanced',
          dataArray: [
            {
              id: '31', // Add a unique identifier to each data object
              leftImageSrc: bnbChainIcon,
              // rightText: '2.35 ETH',
              text: 'BNB Chain 1',
              checkBox: true,
            },
            {
              id: '32',
              leftImageSrc: bitcoinIcon,
              // rightText: '0.77 ETH',
              text: 'Bitcoin 1',
              checkBox: true,
              tag: 'TAPROOT',
            },
            {
              id: '33',
              leftImageSrc: etheriumBlueIcon,
              // rightText: '0.08 ETH',
              text: 'Etherium 3',
              checkBox: true,
            },
          ],
        },
      },
    },
    selectCrypto: {
      info: {
        dialogBox: {
          title: 'Add Coin/Account',
          header: 'Select the Wallet & Coins you want to add',
          subTitle: 'Add a coin/account to wallet',
          constant: 'Cypherock Red',
          buttonName: 'continue',
          searchText: 'Search',
          placeholderText: 'Choose a coin',
          placeholderWalletText: 'Choose a wallet',
          dropDownData: [
            {
              id: '41', // Add a unique identifier to each data object
              leftImageSrc: bnbChainIcon,
              text: 'BNB Chain 1',
              displayRadioButton: true,
            },
            {
              id: '42',
              leftImageSrc: bitcoinIcon,
              text: 'Bitcoin 1',
              tag: 'TAPROOT',
              displayRadioButton: true,
            },
            {
              id: '43',
              leftImageSrc: etheriumBlueIcon,
              text: 'Etherium 3',
              displayRadioButton: true,
            },
          ],
          dropDownDataWithWallet: [
            {
              id: '51', // Add a unique identifier to each data object
              text: 'Official',
              displayRadioButton: true,
            },
            {
              id: '52',
              text: 'Cypherock Red',
              displayRadioButton: true,
            },
            {
              id: '53',
              text: 'Personal',
              displayRadioButton: true,
            },
            {
              id: '54',
              text: 'Business',
              displayRadioButton: true,
            },
          ],
        },
      },
    },
    addAccountSingleChain: {
      info: {
        dialogBox: {
          title: 'Add Coin/Account',
          header: 'Add new accounts',
          subheader: 'New Accounts',
          subheader2: 'Account not yet synced',
          subheader3: 'Accounts already in portfolio',
          subheaderright: 'Deselect all',
          submitButton: 'Add Accounts',
          advanced: 'Show all address types (?)',
          dataArray: [
            {
              id: '2',
              leftImageSrc: bitcoinIcon,
              // rightText: '0.77 ETH',
              text: 'Bitcoin 1',
              checkBox: true,
              tag: 'TAPROOT',
            },
          ],
          accountNotSynced: [
            {
              id: '1',
              leftImageSrc: bitcoinIcon,
              text: 'Bitcoin 2',
              checkBox: true,
              tag: 'TAPROOT',
            },
            {
              id: '22',
              leftImageSrc: bitcoinIcon,
              text: 'Bitcoin 2',
              checkBox: true,
              tag: 'TAPROOT',
            },
            {
              id: '3',
              leftImageSrc: bitcoinIcon,
              text: 'Bitcoin 2',
              checkBox: true,
              tag: 'SEGWIT',
            },
            {
              id: '4',
              leftImageSrc: bitcoinIcon,
              text: 'Bitcoin 2',
              checkBox: true,
              tag: 'NATIVE SEGWIT',
            },
          ],
          accountsInPortfolio: [
            {
              id: '31',
              leftImageSrc: bitcoinIcon,
              text: 'Bitcoin 1',
              checkBox: true,
              tag: 'SEGWIT',
            },
            {
              id: '32',
              leftImageSrc: bitcoinIcon,
              // rightText: '0.77 ETH',
              text: 'Bitcoin 1',
              checkBox: true,
              tag: 'NATIVE SEGWIT',
            },
          ],
        },
      },
    },
  },
};

export type AddAccountStrings = typeof addAccount;

export default addAccount;
