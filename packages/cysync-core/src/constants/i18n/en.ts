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
    setPassword: {
      heading: 'Set Password',
      title: 'Set your cySync password ',
      success: 'Your new password is set',
      newPasswordLabel: 'New Password',
      confirmPasswordLabel: 'Confirm Password',
      hint: 'Use 8 or more characters with a mix of letters, numbers & symbols',
    },
    emailAuth: {
      heading: 'Email Auth',
      title:
        'You are recommended to enter an email ID as a 2FA to get authenticity results ',
      success: 'Your new password is set',
      enterEmailLabel: 'Your Email',
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
      success: 'Your X1 Vault is successfully authenticated',
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
      required: 'Password is required',
      confirmRequired: 'Confirm Password is required',
    },
  },
};

export type LanguageStrings = typeof en;

export default en;
