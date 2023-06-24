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
        'Choose this if you want to migrate your wallets to a new Cypherock X1. This might be required in case your lost your X1 wallet and one or more of the X1 cards.',
    },
    terms: {
      title: 'Terms of Use',
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
    success: {
      title: 'Congratulations',
      subtext: 'Cypherock X1 is now ready to use',
    },
    appUpdate: {
      heading: 'App Update',
      dialogs: {
        confirmation: {
          heading: 'App Update',
          title:
            'A new update is available for your cySync app. Update the app to v1.2 to continue',
          subtext:
            'Your X1 Vault seems to be incompatible with the current cySync app. Update your desktop app to v1.2 to continue',
        },
        updating: {
          heading: 'Updating...',
          subtext: 'Please wait while we update your cySync app',
        },
        updateSuccessful: {
          heading: 'cySync app updated successfully',
          subtext:
            'Please wait while we restart the app to apply the latest update',
          bubbleText:
            'In case, the app does not restart itself, manually start it again',
        },
        updateFailed: {
          heading: 'cySync update to version #{version} failed',
          subtext:
            'Something went wrong, try updating again or contact support',
          buttons: {
            retry: 'Retry',
          },
        },
        updateFailedFallback: {
          heading: 'cySync app update to version #{version} failed',
          subtext: 'Download and reinstall the desktop app from the link below',
          alertText: 'Close this app before reinstalling the latest cySync app',
        },
      },
    },
    deviceUpdate: {
      heading: 'Device Update',
      dialogs: {
        confirmation: {
          heading: 'Device Update',
          title:
            'A new update is available for your X1 Vault. Update the device to v1.2 to continue',
          subtext: 'Follow the instruction on the device',
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
          subtext:
            'Your device is now operating on the latest software version',
        },
        updateFailed: {
          heading: 'Firmware update failed',
          subtext: 'Reconnect the device to proceed',
        },
      },
    },
  },

  errors: {
    deviceErrors,
    default: 'Some internal error occurred',
  },
};

export type LanguageStrings = typeof en;

export default en;
