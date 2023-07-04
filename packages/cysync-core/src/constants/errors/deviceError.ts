import {
  DeviceConnectionErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceBootloaderErrorType,
  DeviceAppErrorType,
} from '@cypherock/sdk-interfaces';

import { DeviceErrorCodes } from '~/types/deviceError';

import { ErrorHandlingDetails, ErrorIconNameMap } from './types';

export const deviceErrorHandlingDetails: Record<
  DeviceErrorCodes,
  ErrorHandlingDetails
> = {
  [DeviceConnectionErrorType.NOT_CONNECTED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceConnectionErrorType.CONNECTION_CLOSED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceCommunicationErrorType.IN_BOOTLOADER]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceCommunicationErrorType.WRITE_REJECTED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceCommunicationErrorType.WRITE_ERROR]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceCommunicationErrorType.WRITE_TIMEOUT]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceCommunicationErrorType.READ_TIMEOUT]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceCompatibilityErrorType.INVALID_SDK_OPERATION]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceConnectionErrorType.CONNECTION_CLOSED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceConnectionErrorType.FAILED_TO_CONNECT]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.NOT_IN_BOOTLOADER]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.FIRMWARE_SIZE_LIMIT_EXCEEDED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.WRONG_HARDWARE_VERSION]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.WRONG_MAGIC_NUMBER]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.SIGNATURE_NOT_VERIFIED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.LOWER_FIRMWARE_VERSION]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.FLASH_WRITE_ERROR]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.FLASH_CRC_MISMATCH]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.FLASH_TIMEOUT_ERROR]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.FLASH_NACK]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceBootloaderErrorType.NOT_IN_RECEIVING_MODE]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.UNKNOWN_ERROR]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.EXECUTING_OTHER_COMMAND]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.PROCESS_ABORTED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.DEVICE_ABORT]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.INVALID_APP_ID_FROM_DEVICE]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.INVALID_MSG]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.UNKNOWN_APP]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.APP_NOT_ACTIVE]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.DEVICE_SETUP_REQUIRED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.WALLET_NOT_FOUND]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.WALLET_PARTIAL_STATE]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.NO_WALLET_EXISTS]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.CARD_OPERATION_FAILED]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.USER_REJECTION]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
  [DeviceAppErrorType.CORRUPT_DATA]: {
    iconName: ErrorIconNameMap.device,
    action: {
      retry: true,
    },
  },
};
