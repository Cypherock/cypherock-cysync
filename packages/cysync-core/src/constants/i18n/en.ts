import {
  DeviceAppErrorType,
  DeviceBootloaderErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';

import { DeviceErrorCodes } from './types';

const deviceErrors: Record<DeviceErrorCodes, string> = {
  [DeviceConnectionErrorType.NOT_CONNECTED]: 'No device connected',
  [DeviceConnectionErrorType.DEVICE_DISCONNECTED_IN_FLOW]:
    'Device disconnected in flow',
  [DeviceConnectionErrorType.CONNECTION_CLOSED]:
    'Connection was closed while in process',
  [DeviceConnectionErrorType.CONNECTION_NOT_OPEN]: 'Connection was not open',
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]:
    'Failed to create device connection',
  [DeviceCommunicationErrorType.IN_BOOTLOADER]: 'Device is in bootloader mode',
  [DeviceCommunicationErrorType.WRITE_REJECTED]:
    'The write packet operation was rejected by the device',
  [DeviceCommunicationErrorType.WRITE_ERROR]:
    'Unable to write packet to the device',
  [DeviceCommunicationErrorType.TIMEOUT_ERROR]:
    'Timeout Error due to write/read',
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
  [DeviceConnectionErrorType.DEVICE_DISCONNECTED_IN_FLOW]:
    'Device disconnected in flow',
  [DeviceConnectionErrorType.CONNECTION_CLOSED]:
    'Connection was closed while in process',
  [DeviceConnectionErrorType.CONNECTION_NOT_OPEN]: 'Connection was not open',
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]:
    'Failed to create device connection',
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
  [DeviceAppErrorType.NO_WORKING_PACKET_VERSION]:
    'No working packet version found',
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
};

const en = {
  x1Card: 'X1 Card',
  help: 'Help',
  back: 'Back',
  buttons: {
    continue: 'Continue',
    confirm: 'Confirm',
  },
  onboarding: {
    info: {
      aside: {
        title: 'Welcome to CySync App',
        subTitle: 'Your Gateway to Self-Sovereignty',
      },
      dialogBox: {
        title: 'Ensure the following before you continue',
        listItems: [
          'You are present in a safe and secure environment',
          'You have atleast 15-30 minutes to setup your wallet',
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
        'Choose this if you want to migrate your wallets to a new Cypherock X1. This might be required in case your lost your X1 wallet and one or more of the X1 cards.',
    },
    terms: {
      title: 'Terms of use',
      bulletPoints: {
        terms: 'Terms Of Service',
        privacyPolicy: 'Privacy Policy',
      },
      consent:
        ' I have read and agree with the Terms of Use and Privacy Policy',
    },
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
      error: 'Device Authentication has failed',
      errorSubtext:
        'Device seems to be Compromised. Contact Cypherock support immediately',
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
      success: 'Joystick test complete',
      error: 'Joystick Training has failed',
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
          `You want to transfer your assets from your other wallets into Cypherock
          X1. `,
          ` You want to transfer your assets from your other wallets into Cypherock
          X1. `,
          `You want to see all portfolio of your other wallets through Cypherock
          X1. `,
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
        tabs: ['Device', 'Sync X1 Cards', 'Confirmation'],
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
          third:
            'In case you lose your X1 Vault, you can buy a new X1 Vault separately and use it with your old X1 Cards ',
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
    },
    success: {
      title: 'Congratulations',
      subtext: 'Cypherock X1 is now ready to use',
    },
  },
  errors: {
    deviceErrors,
    default: 'Some internal error occured',
  },
};

export type LanguageStrings = typeof en;

export default en;
