import {
  DeviceConnectionErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceBootloaderErrorType,
  DeviceAppErrorType,
  CardAppErrorType,
} from '@cypherock/sdk-interfaces';

import { DeviceErrorCodes } from '~/types/deviceError';

import { ErrorHandlingDetails, ErrorIconNameMap } from './types';

const defaultDeviceErrorHandlingDetails: ErrorHandlingDetails = {
  iconName: ErrorIconNameMap.device,
  action: {
    retry: true,
  },
};

export const deviceErrorHandlingDetails: Record<
  DeviceErrorCodes,
  ErrorHandlingDetails
> = {
  [DeviceConnectionErrorType.NOT_CONNECTED]: defaultDeviceErrorHandlingDetails,
  [DeviceConnectionErrorType.CONNECTION_CLOSED]:
    defaultDeviceErrorHandlingDetails,
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]:
    defaultDeviceErrorHandlingDetails,
  [DeviceCommunicationErrorType.IN_BOOTLOADER]:
    defaultDeviceErrorHandlingDetails,
  [DeviceCommunicationErrorType.WRITE_REJECTED]:
    defaultDeviceErrorHandlingDetails,
  [DeviceCommunicationErrorType.WRITE_ERROR]: defaultDeviceErrorHandlingDetails,
  [DeviceCommunicationErrorType.WRITE_TIMEOUT]:
    defaultDeviceErrorHandlingDetails,
  [DeviceCommunicationErrorType.READ_TIMEOUT]:
    defaultDeviceErrorHandlingDetails,
  [DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR]:
    defaultDeviceErrorHandlingDetails,
  [DeviceCompatibilityErrorType.INVALID_SDK_OPERATION]:
    defaultDeviceErrorHandlingDetails,
  [DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED]:
    defaultDeviceErrorHandlingDetails,
  [DeviceConnectionErrorType.CONNECTION_CLOSED]:
    defaultDeviceErrorHandlingDetails,
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.NOT_IN_BOOTLOADER]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.FIRMWARE_SIZE_LIMIT_EXCEEDED]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.WRONG_HARDWARE_VERSION]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.WRONG_MAGIC_NUMBER]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.SIGNATURE_NOT_VERIFIED]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.LOWER_FIRMWARE_VERSION]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.FLASH_WRITE_ERROR]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.FLASH_CRC_MISMATCH]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.FLASH_TIMEOUT_ERROR]:
    defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.FLASH_NACK]: defaultDeviceErrorHandlingDetails,
  [DeviceBootloaderErrorType.NOT_IN_RECEIVING_MODE]:
    defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.UNKNOWN_ERROR]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.EXECUTING_OTHER_COMMAND]:
    defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.PROCESS_ABORTED]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.DEVICE_ABORT]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]:
    defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.INVALID_APP_ID_FROM_DEVICE]:
    defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.INVALID_MSG]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.UNKNOWN_APP]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.APP_NOT_ACTIVE]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.DEVICE_SETUP_REQUIRED]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.WALLET_NOT_FOUND]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.WALLET_PARTIAL_STATE]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.NO_WALLET_EXISTS]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.CARD_OPERATION_FAILED]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.USER_REJECTION]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.CORRUPT_DATA]: defaultDeviceErrorHandlingDetails,
  [DeviceAppErrorType.DEVICE_AUTH_FAILED]: {
    ...defaultDeviceErrorHandlingDetails,
    action: {
      report: true,
    },
  },
  [DeviceAppErrorType.CARD_AUTH_FAILED]: {
    ...defaultDeviceErrorHandlingDetails,
    action: {
      report: true,
    },
  },
  [CardAppErrorType.UNKNOWN]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.NOT_PAIRED]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_INCOMPATIBLE_APPLET]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_NULL_POINTER_EXCEPTION]:
    defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_TRANSACTION_EXCEPTION]:
    defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_FILE_INVALID]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_SECURITY_CONDITIONS_NOT_SATISFIED]:
    defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_CONDITIONS_NOT_SATISFIED]:
    defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_WRONG_DATA]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_FILE_NOT_FOUND]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_RECORD_NOT_FOUND]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_FILE_FULL]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_CORRECT_LENGTH_00]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_INVALID_INS]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_NOT_PAIRED]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_CRYPTO_EXCEPTION]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.POW_SW_WALLET_LOCKED]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_INS_BLOCKED]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.SW_OUT_OF_BOUNDARY]: defaultDeviceErrorHandlingDetails,
  [CardAppErrorType.UNRECOGNIZED]: defaultDeviceErrorHandlingDetails,
};
