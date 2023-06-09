const en = {
  x1Card: 'X1 Card',
  help: 'Help',
  back: 'Back',
  onboarding: {
    deviceDetection: {
      heading: 'Device Connection',
      title: 'Connect your X1 Vault to your PC to proceed',
      subtext:
        'Use the USB cable provided in your product packaging to connect',
    },
    deviceAuth: {
      heading: 'Device Authentication',
      subtext:
        'Your X1 Vault will now be authenticated\nthrough Cypherock to check its\nauthenticity',
      success: 'Your X1 Vault is successfully authenticated',
    },
    joystickTraining: {
      heading: 'Joystick Checkup',
      subtext: 'X1 Vault provides 4 way joystick for\nscreen navigation',
      upTitle: 'Toggle Up',
      rightTitle: 'Toggle Right',
      downTitle: 'Toggle Down',
      leftTitle: 'Toggle Left',
      centerTitle: 'Center click the joystick to proceed',
      centerSubtext: 'X1 Vault has a center button to\nperform click',
      footer: 'Follow the instruction on the device',
      success: 'Your X1 Vault is successfully authenticated',
    },
    cardTraining: {
      heading: 'Card Tap Checkup',
      title: 'Tap any X1 Card below the X1 Vault to test card tapping',
    },
    cardAuth: {
      heading: 'Card Authentication',
      title: 'Tap X1 Cards one by one below the\nX1 Vault',
      subtext: 'Do not lift until you hear 3 beep sounds',
    },
    walletActionsDialogBox: {
      title: `Let's create a wallet before we proceed. Make sure you have all the 4 X1 cards with you`,
      subTitle:
        'The following tutorials are just there to guide you on your X1 vault. You can create a wallet even without these tutorials independently on your Cypherock X1',
      createWallet: {
        title: 'Create a new wallet',
        list: [
          'If you have bought a brand new Cypherock X1 and want to setup a new wallet',
        ],
        button: 'Create',
      },
      importWallet: {
        title: 'Import your wallet from a seed phrase',
        list: [
          `You want to transfer your assets from your other wallets into Cypherock
          X1. `,
          ` You want to transfer your assets from your other wallets into Cypherock
          X1. `,
          `You want to see all portfolio of your other wallets through Cypherock
          X1. `,
        ],
        button: 'Import',
      },
      footer: {
        title: 'Transfer from old to new Cypherock X1',
        subTitle: `If you ever had a Cypherock X1 and want to migrate your wallets to a new Cypherock X1. This might be required in case your lost your X1 wallet and one or more of the X1 cards whatsoever, we don't judge`,
        button: 'Transfer',
      },
    },
    createWallet: {
      aside: {
        tabs: {
          device: 'Device',
          syncX1Cards: 'Sync X1 Cards',
          confirmation: 'Confirmation',
        },
      },
      followInfo: {
        heading: 'Setup Wallet Name',
        title: 'Follow Instructions on the X1 Vault',
        list: {
          first: {
            first: 'Your X1 Vault should be on the ',
            second: 'Main Menu',
          },
          second: {
            first: 'On the Main Menu, Click on "',
            second: 'Create Wallet',
            third: '" and then Select "',
            fourth: 'Generate a new Wallet',
            fifth: '"',
          },
        },
      },
      enterWalletName: {
        heading: 'Setup Wallet Name',
        title: 'Enter a wallet name on your X1 Vault',
        list: [`Upto 13 characters allowed`, `It can be alphanumeric`],
        note: 'Make sure that the wallet name is unique to other wallet names on the device',
      },
      confirmWallet: {
        heading: 'Setup Wallet Name',
        title: 'Confirm wallet name on the X1 Vault',
      },
      setupPinConsent: {
        heading: 'Setup Wallet Security',
        title: 'Do you want to setup a PIN for your wallet?',
        subTitle:
          'The PIN once set cannot be changed. You will have to delete the wallet and create again in order to change the PIN',
      },
      enterPin: {
        heading: 'Setup Wallet Security',
        title: 'Setup a PIN on the X1 Vault',
        list: ['Use between 4 and 8 characters', 'The PIN can be alphanumeric'],
        note: 'Make sure you make a backup of your PIN, if you lose it , you lose access to your funds',
      },
      confirmPin: {
        heading: 'Setup Wallet Security',
        title: 'Confirm the entered PIN on the  X1 Vault again',
        loading: 'Please wait...',
        list: [
          `Remember your PIN, if you lose it, you lose access to your funds. Even Cypherock won't be able to help you recover your assets`,
          `Backup it up in a safe place`,
        ],
      },
    },
    success: {
      title: 'Congratulations',
      subtext: 'Cypherock X1 is now ready to use',
    },
  },
};

export type LanguageStrings = typeof en;

export default en;
