/* eslint-disable no-template-curly-in-string */
import {
  DeviceAppErrorType,
  DeviceBootloaderErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';
import {
  bitcoinIcon,
  bnbChainIcon,
  etheriumBlueIcon,
  checkIcon,
  halfLoaderGold,
} from '@cypherock/cysync-ui';
import { DeviceErrorCodes } from '~/types/deviceError';

const deviceErrors: Record<DeviceErrorCodes, string> = {
  [DeviceConnectionErrorType.NOT_CONNECTED]: 'No device connected',
  [DeviceConnectionErrorType.CONNECTION_CLOSED]:
    'Connection was closed while in process',
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]:
    'Failed to create device connection',
  [DeviceCommunicationErrorType.IN_BOOTLOADER]: 'Device is in bootloader mode',
  [DeviceCommunicationErrorType.WRITE_REJECTED]:
    'The write packet operation was rejected by the device',
  [DeviceCommunicationErrorType.WRITE_ERROR]:
    'Unable to write packet to the device',
  [DeviceCommunicationErrorType.WRITE_TIMEOUT]:
    'Did not receive ACK of sent packet on time',
  [DeviceCommunicationErrorType.READ_TIMEOUT]:
    'Did not receive the expected data from device on time',
  [DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR]:
    'Unknown Error at communication module',
  [DeviceCompatibilityErrorType.INVALID_SDK_OPERATION]:
    'The device sdk does not support this function',
  [DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED]:
    'The connected device is not supported by this SDK',
  [DeviceBootloaderErrorType.NOT_IN_BOOTLOADER]:
    'The device is not in bootloader mode',
  [DeviceBootloaderErrorType.FIRMWARE_SIZE_LIMIT_EXCEEDED]:
    'Firmware Size Limit Exceed',
  [DeviceBootloaderErrorType.WRONG_HARDWARE_VERSION]: 'Wrong Hardware version',
  [DeviceBootloaderErrorType.WRONG_MAGIC_NUMBER]: 'Wrong Magic Number',
  [DeviceBootloaderErrorType.SIGNATURE_NOT_VERIFIED]: 'Signature not verified',
  [DeviceBootloaderErrorType.LOWER_FIRMWARE_VERSION]: 'Lower Firmware version',
  [DeviceBootloaderErrorType.FLASH_WRITE_ERROR]: 'Flash Write Error',
  [DeviceBootloaderErrorType.FLASH_CRC_MISMATCH]: 'Flash CRC Mismatch',
  [DeviceBootloaderErrorType.FLASH_TIMEOUT_ERROR]: 'Flash Timeout Error',
  [DeviceBootloaderErrorType.FLASH_NACK]: 'Flash Negative Acknowledgement',
  [DeviceBootloaderErrorType.NOT_IN_RECEIVING_MODE]:
    'The device is in fault state',
  [DeviceAppErrorType.UNKNOWN_ERROR]: 'Unknown application error',
  [DeviceAppErrorType.EXECUTING_OTHER_COMMAND]:
    'The device is executing some other command',
  [DeviceAppErrorType.PROCESS_ABORTED]: 'The process was aborted',
  [DeviceAppErrorType.DEVICE_ABORT]: 'The request was timed out on the device',
  [DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]:
    'Invalid result received from device',
  [DeviceAppErrorType.INVALID_APP_ID_FROM_DEVICE]:
    'Invalid appId received from device',
  [DeviceAppErrorType.INVALID_MSG]: 'Invalid result sent from app',
  [DeviceAppErrorType.UNKNOWN_APP]: 'The app does not exist on device',
  [DeviceAppErrorType.APP_NOT_ACTIVE]: 'The app is active on the device',
  [DeviceAppErrorType.DEVICE_SETUP_REQUIRED]: 'Device setup is required',
  [DeviceAppErrorType.WALLET_NOT_FOUND]:
    'Selected wallet is not present on the device',
  [DeviceAppErrorType.WALLET_PARTIAL_STATE]:
    'Selected wallet is in partial state',
  [DeviceAppErrorType.NO_WALLET_EXISTS]: 'No wallet exists on the device',
  [DeviceAppErrorType.CARD_OPERATION_FAILED]: 'Card operation failed',
  [DeviceAppErrorType.USER_REJECTION]: 'User rejected the operation',
  [DeviceAppErrorType.CORRUPT_DATA]: 'Corrupt data error from device',
  [DeviceAppErrorType.DEVICE_AUTH_FAILED]:
    'Device seems to be Compromised. Contact Cypherock support immediately',
  [DeviceAppErrorType.CARD_AUTH_FAILED]:
    'Card seems to be Compromised. Contact Cypherock support immediately',
};

const en = {
  x1Card: 'X1 Card',
  help: 'Help',
  back: 'Back',
  buttons: {
    continue: 'Continue',
    confirm: 'Confirm',
    skip: 'Skip',
    retry: 'Retry',
    update: 'Update',
    cancel: 'Cancel',
    reset: 'Reset',
  },
  lockscreen: {
    title: 'Your Gateway to Self-Sovereignty',
    passwordLabel: 'Enter Password to unlock cySync',
    forgotPassword: 'Forgot password?',
    incorrectPassword: 'Incorrect password',
    button: 'Unlock',
    forgotPasswordDialog: {
      title:
        'Resetting password will reset your cySync app do you want to proceed?',
      subtext:
        'This will erase all your data on your cySync app. Note this will not result in loss of assets',
    },
  },
  permissionSetup: {
    title:
      'Press run the following command on your terminal to allow the application to access usb port',
    subtext: 'Restart the application after running the script',
    checkbox: 'I have already run the command',
  },
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
  syncAccount: {},
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
  addAccount: {
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
  onboarding: {
    info: {
      aside: {
        title: 'Welcome to cySync app',
        subTitle: 'Your Gateway to Self-Sovereignty',
      },
      dialogBox: {
        title: 'Ensure the following before you continue',
        listItems: [
          'You are present in a safe and secure environment',
          'You have atleast 10-15 minutes to setup your wallet',
          'You have an active internet connection',
          'The tamper-proof seal of the package is intact',
          'Cypherock will never ask you for your seed phrase nor will it ever ask you to sign a transaction',
          'Cypherock will only email you from cypherock.com. Do not trust any email from any other website domain',
        ],
      },
    },
    usage: {
      titleFirst: 'I am using Cypherock X1 for the first time',
      titleSecond: 'I have already used a Cypherock X1',
      subTitleFirst: 'Choose this if you have never used Cypherock X1 before',
      subTitleSecond:
        'Choose this if you want to migrate your wallets to a new Cypherock X1. This might be required in case you lost your X1 Vault and one or more of the X1 Cards',
    },
    terms: {
      title: 'Terms of Use',
      subtext:
        'Take some time to review our Terms of Service and Privacy Policy',
      bulletPoints: {
        terms: 'Terms of Service',
        privacyPolicy: 'Privacy Policy',
      },
      consent:
        ' I have read and agree with the Terms of Use and Privacy Policy',
    },
    setPassword: {
      heading: 'Set Password',
      title: 'Set your cySync password ',
      subtitle: 'We do not store your password on our servers',
      success: 'Your cySync password has been successfully set',
      newPasswordLabel: 'New Password',
      confirmPasswordLabel: 'Confirm Password',
      hint: 'Use 8 or more characters with a mix of letters, numbers & symbols',
    },
    emailAuth: {
      heading: 'Email Auth',
      title:
        'You are recommended to enter an email ID as a 2FA to get authenticity results ',
      subtitle: 'We do not store this email ID permanently on our servers ',
      success: 'Your cySync password has been successfully set',
      enterEmailLabel: 'Email',
      placeholder: 'Email',
    },
    deviceDetection: {
      heading: 'Device Connection',
      title: 'Connect your X1 Vault to your PC to proceed',
      subtext:
        'Use the USB cable provided in your product packaging to connect',
    },
    deviceAuth: {
      heading: 'Device Authentication',
      title:
        'Your X1 Vault will now be authenticated\nthrough Cypherock to check its\nauthenticity ',
      subtext:
        'Do not disconnect your device while the operation is being done',
      success: {
        title: 'Your X1 Vault is successfully authenticated',
        subtext: 'Wait while we take you to the next screen',
      },
      error: 'X1 Vault authentication has failed',
    },
    joystickTraining: {
      heading: 'Joystick Instructions',
      subtext: 'X1 Vault provides 4 way joystick for screen navigation',
      upTitle: 'Toggle Up',
      rightTitle: 'Toggle Right',
      downTitle: 'Toggle Down',
      leftTitle: 'Toggle Left',
      centerTitle: 'Center click the joystick to proceed',
      centerSubtext: 'X1 Vault has a center button to perform click',
      footer: 'Follow the instructions on the device',
      success: 'Joystick instructions completed',
      error: 'Joystick instructions has failed',
    },
    cardTraining: {
      heading: 'Card Tapping Instructions',
      title: 'Tap any X1 Card below the X1 Vault to test card tapping',
      subtext:
        'Your cards communicate with the device through encrypted NFC. Make sure you keep it tapped until you hear a beep sound',
      error: 'Card Tapping has failed',
    },
    cardAuth: {
      heading: 'Card Authentication',
      title:
        'Tap X1 Cards one by one below the \n' +
        'X1 Vault till you hear 3 beep sounds',
      subtext: 'Lift your card after 3 beep sounds',
    },
    walletActionsDialogBox: {
      title: `Let's add a wallet before we proceed. Make sure you have all the 4 X1 cards with you`,
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
          `You want to use Cypherock X1 as a backup of your other wallets `,
          `You want to transfer your assets from your other wallets into Cypherock X1 `,
          `You want to manage and track portfolio of your other wallets through Cypherock X1 `,
        ],
        button: 'Import',
      },
      transferWallet: {
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
        subTitle:
          'The wallet name once set cannot be changed afterwards. You have to delete and recreate the wallet again if you need to change the wallet name in the future',
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
        list: [`Upto 15 characters allowed`, `It can be alphanumeric`],
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
        subTitle:
          // todo: change the question mark color to gold.
          'Make sure you make a backup of your PIN. If you lose the PIN, you will lose access to your funds. Even Cypherock will not be able to help recover your assets (?)',
        list: ['Use between 4 and 8 characters', 'The PIN can be alphanumeric'],
        // todo: change the question mark color to gold.
        note: 'Make sure you make a backup of your PIN, if you lose it , you lose access to your funds (?)',
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
      syncX1Cards: {
        heading: 'Create New Wallet',
        title: 'Tap X1 Cards one by one below the X1 Vault',
        subTitle: 'Do not lift until you hear a beep sound',
        list: [
          'Make sure your X1 Cards belong to the same family',
          'Make sure you tap the X1 Cards in the correct order',
        ],
      },
      walletCreationSuccess: {
        heading: 'Congratulations',
        titles: {
          first: 'Congratulations, your wallet is now successfully created',
          second:
            'The next time you need to make a transaction, you just need to fetch any one X1 Card along with the X1 Vault',
          // todo: change the question mark color to gold.
          third:
            'In case you lose your X1 Vault, you can buy a new X1 Vault separately and use it with your old X1 Cards (?)',
        },
      },
      finalMessage: {
        cardSafety: {
          heading: 'Final Message',
          title: 'Important Note',
          note: 'In case you need to add another wallet, you will need to fetch all of the 4 X1 cards together. In case you want to import your other wallets into Cypherock X1, now is the best time to avoid the future hassle',
        },
        addAnotherWallet: {
          heading: 'Final Message',
          title:
            'As a next step, keep your X1 Cards safely inside the card sleeves and distribute them into different places. Some examples of the places could be:',
          list: [
            'Homes of your family members or your friends',
            'Secret hideout',
            'Bank locker',
          ],
        },
        addAccount: {
          heading: 'Final Message',
          title:
            'To add coins and tokens in wallet, you have to add an account first. Make sure you have the X1 Vault and an X1 Card handy with you.',
          buttons: {
            skip: 'Skip',
            addAccount: 'Add Account',
          },
        },
        walletNotCreatedDialog: {
          title: "Seems like you haven't created a wallet yet",
          subTitle: 'To add an account you have to first create a wallet',
          buttons: {
            later: 'I will do it later',
            createWallet: 'Create Wallet',
          },
        },
      },
      onClose: {
        title: 'You can start this guide from the sidebar',
        subTitle: 'Are you sure you want to exit?',
        buttons: {
          cancel: 'Cancel',
          exit: 'Exit',
        },
      },
    },
    success: {
      title: 'Congratulations',
      subtext: 'Cypherock X1 is now ready to use',
    },
    appUpdate: {
      heading: 'App Update',
      dialogs: {
        checking: {
          heading: 'App Update',
          title: 'Please wait while we check for Cypherock CySync updates',
        },
        checkingFailed: {
          heading: 'App Update',
          title: 'An error occurred while checking for update',
          subtext:
            'Something went wrong, check your internet connection and try again',
        },
        confirmation: {
          heading: 'App Update',
          title:
            'A new update is available for your cySync app. Update the app to v${version} to continue',
          subtext:
            'Your X1 Vault seems to be incompatible with the current cySync app. Update your desktop app to v${version} to continue',
        },
        downloading: {
          heading: 'Updating...',
          subtext: 'Please wait while we update your cySync app',
          version: 'Version ${version}',
        },
        updateSuccessful: {
          heading: 'cySync app updated successfully',
          subtext:
            'Please wait while we restart the app to apply the latest update',
          bubbleText:
            'In case, the app does not restart itself, manually start it again',
        },
        updateFailed: {
          heading: 'cySync update to version ${version} failed',
          subtext:
            'Something went wrong, try updating again or contact support',
          buttons: {
            retry: 'Retry',
          },
        },
        updateFailedFallback: {
          heading: 'cySync app update to version ${version} failed',
          subtext: 'Download and reinstall the desktop app from the link below',
          alertText: 'Close this app before reinstalling the latest cySync app',
        },
      },
    },
    deviceUpdate: {
      heading: 'Device Update',
      dialogs: {
        checking: {
          title: 'Please wait while we check for X1 Vault updates',
        },
        confirmation: {
          heading: 'Device Update',
          title:
            'A new update is available for your X1 Vault. Update the device to v${version} to continue',
          subtext: 'Follow the instructions on the device',
        },
        loading: {
          text: 'Please wait while we check for X1 Vault updates',
        },
        updating: {
          heading: 'Updating...',
          subtext: 'Please wait while we update your X1 Vault',
        },
        updateSuccessful: {
          heading: 'X1 Vault updated successfully',
          subtext: 'Your device is now operating on the latest firmware',
        },
        updateFailed: {
          heading: 'Firmware update failed',
          subtext: 'Reconnect the device to proceed',
        },
      },
    },
  },
  topbar: {
    statusTexts: {
      connection: {
        connected: 'Connected',
        disconnected: 'Disconnected',
        error: 'Connection error!',
      },
      sync: {
        syncronized: 'Syncronized',
        syncronizing: 'Syncronizing...',
        error: 'Sync error!',
      },
    },
  },
  walletSync: {
    freshOneCreated: {
      title:
        'Seems like you have deleted wallets from the X1 Vault while creating new ones by the same name. Do you want to delete the old wallets on cySync?',
      subTitle: 'You can chose which one to keep and which one to delete',
      checkboxList: {
        cypherockRed: 'Cypherock Red',
        official: 'Official',
        personal: 'Personal',
      },
      checkboxText: "Don't show this again",
    },
    buttons: {
      keepAll: 'Keep All',
      delete: 'Delete',
    },
  },
  portfolio: {
    title: 'Portfolio',
  },
  errors: {
    deviceErrors,
    default: 'Some internal error occurred',
  },
  validation: {
    generic: {
      required: 'This field is required',
    },
    email: {
      invalid: 'This is not a valid email',
    },
    password: {
      mismatch: 'Passwords do not match',
      passwordFieldPrefix: 'Password ',
      confirmPasswordFieldPrefix: 'Confirm Password ',
      minLength: 'must be at least 8 characters',
      containNumber: 'must contain at least 1 number',
      containSymbol: 'must contain at least 1 symbol',
      required: 'is required',
      containUppercase: 'must contain at least 1 uppercase letter',
      containLowercase: 'must contain at least 1 lowercase letter',
    },
  },
};

export type LanguageStrings = typeof en;

export default en;
