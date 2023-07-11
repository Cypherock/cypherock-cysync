/* eslint-disable no-template-curly-in-string */
import {
  DeviceAppErrorType,
  DeviceBootloaderErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceConnectionErrorType,
} from '@cypherock/sdk-interfaces';

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
    checkbox: 'I have already ran the command',
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
        'Your X1 Vault will now be authenticated through Cypherock server to check its authenticity ',
      subtext:
        'Do not disconnect your device while the operation is being done',
      success: 'Your X1 Vault is successfully authenticated',
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
      error: 'Card Tapping has failed',
    },
    cardAuth: {
      heading: 'Card Authentication',
      title: 'Tap X1 Cards one by one below the X1 Vault',
      subtext: 'Do not lift until you hear 3 beep sounds',
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
  importWallet: {
    aside: {
      tabs: {
        device: 'Device',
        syncX1Cards: 'Sync X1 Cards',
        confirmation: 'Confirmation',
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
    device: {
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
        subTitle:
          'Make sure you make a backup of your PIN. If you lose the PIN, you will lose access to your funds. Even Cypherock will not be able to help recover your assets (?)',
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
      countNumberOfWords: {
        heading: 'Setup Wallet Security',
        title:
          'Count the number of words of the seed phrase which you are importing and select it on the X1 Vault',
      },
      enterSeedPhrase: {
        heading: 'Setup Wallet Security',
        title: 'Enter the seed phrase on the X1 Vault',
        note: 'Make sure you do not make spelling mistakes while entering the words on the X1 wallet. Words like "west" & "nest" are often confusing while reading and needs to be entered correctly',
      },
      verifySeedPhrase: {
        heading: 'Setup Wallet Security',
        title: 'Verify the seed phrase that you entered on the X1 Vault',
        subTitle:
          'Match each and every to successfully import the correct wallet',
      },
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
    confirmation: {
      walletCreationSuccess: {
        heading: 'Congratulations',
        titles: {
          first: 'Congratulations, your wallet is now successfully created',
          second:
            'The next time you need to make a transaction, you just need to fetch any one X1 Card along with the X1 Vault',
          // question mark should be golden
          third:
            'In case you lose your X1 Vault, you can buy a new X1 Vault separately and use it with your old X1 Cards (?)',
        },
      },
      finalMessage: {
        cardSafety: {
          heading: 'Final Message',
          title: 'Important Note',
          note: 'In case you need to add another wallet, you will need to fetch all of the 4 X1 cards together. In case you want to import your other wallets into Cypherock X1, now is the best time to avoid the future hassle',
          buttons: {
            skip: 'Skip for now',
            importOtherWallets: 'Import other wallets',
          },
        },
        addAnotherWallet: {
          heading: 'Final Message',
          // question mark should be golden
          title:
            'As a next step, keep your X1 Cards safely inside the card sleeves (?) and distribute them into different places. Some examples of the places could be:',
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
    },
  },
};

export type LanguageStrings = typeof en;

export default en;
