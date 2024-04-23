import { GetLogsErrorType } from '@cypherock/sdk-app-manager';
import {
  DeviceConnectionErrorType,
  DeviceCommunicationErrorType,
  DeviceCompatibilityErrorType,
  DeviceBootloaderErrorType,
  DeviceAppErrorType,
  CardAppErrorType,
} from '@cypherock/sdk-interfaces';

import { ILangState } from '~/store';
import { DeviceErrorCodes } from '~/types/deviceError';

import { createErrorHandlingDetailsGenerator } from './helpers';
import { ErrorHandlingDetails, ErrorIconNameMap } from './types';

const generateErrorHandlingDetails = createErrorHandlingDetailsGenerator(
  ErrorIconNameMap.device,
);

export const getDeviceErrorHandlingDetails = (
  lang: ILangState,
  errorCode: DeviceErrorCodes,
) => {
  const deviceErrorHandlingDetailsMap: Record<
    DeviceErrorCodes,
    ErrorHandlingDetails | undefined
  > = {
    // Connection Errors
    [DeviceConnectionErrorType.NOT_CONNECTED]:
      generateErrorHandlingDetails.retry(),
    [DeviceConnectionErrorType.CONNECTION_CLOSED]:
      generateErrorHandlingDetails.retry(),
    [DeviceConnectionErrorType.FAILED_TO_CONNECT]:
      generateErrorHandlingDetails.retry(),

    // Communication Errors
    [DeviceCommunicationErrorType.IN_BOOTLOADER]:
      generateErrorHandlingDetails.updateFirmware(),
    [DeviceCommunicationErrorType.WRITE_REJECTED]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceCommunicationErrorType.WRITE_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceCommunicationErrorType.WRITE_TIMEOUT]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceCommunicationErrorType.READ_TIMEOUT]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),

    // Compatibility Errors
    [DeviceCompatibilityErrorType.INVALID_SDK_OPERATION]:
      generateErrorHandlingDetails.updateFirmware(),
    [DeviceCompatibilityErrorType.DEVICE_NOT_SUPPORTED]:
      generateErrorHandlingDetails.update(),

    // Bootloader Errors
    [DeviceBootloaderErrorType.NOT_IN_BOOTLOADER]:
      generateErrorHandlingDetails.retryWithHelp('safeMode'),
    [DeviceBootloaderErrorType.FIRMWARE_SIZE_LIMIT_EXCEEDED]:
      generateErrorHandlingDetails.report(),
    [DeviceBootloaderErrorType.WRONG_HARDWARE_VERSION]:
      generateErrorHandlingDetails.report(),
    [DeviceBootloaderErrorType.WRONG_MAGIC_NUMBER]:
      generateErrorHandlingDetails.report(),
    [DeviceBootloaderErrorType.SIGNATURE_NOT_VERIFIED]:
      generateErrorHandlingDetails.report(),
    [DeviceBootloaderErrorType.LOWER_FIRMWARE_VERSION]:
      generateErrorHandlingDetails.report(),
    [DeviceBootloaderErrorType.FLASH_WRITE_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceBootloaderErrorType.FLASH_CRC_MISMATCH]:
      generateErrorHandlingDetails.report(),
    [DeviceBootloaderErrorType.FLASH_TIMEOUT_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceBootloaderErrorType.FLASH_NACK]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceBootloaderErrorType.NOT_IN_RECEIVING_MODE]:
      generateErrorHandlingDetails.retryWithReport(),

    // App Errors
    [DeviceAppErrorType.UNKNOWN_ERROR]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceAppErrorType.EXECUTING_OTHER_COMMAND]:
      generateErrorHandlingDetails.retry(),
    [DeviceAppErrorType.PROCESS_ABORTED]: generateErrorHandlingDetails.retry(),
    [DeviceAppErrorType.DEVICE_ABORT]: generateErrorHandlingDetails.retry(),
    [DeviceAppErrorType.INVALID_MSG_FROM_DEVICE]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceAppErrorType.INVALID_APP_ID_FROM_DEVICE]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceAppErrorType.INVALID_MSG]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceAppErrorType.UNKNOWN_APP]: generateErrorHandlingDetails.retry(),
    [DeviceAppErrorType.APP_NOT_ACTIVE]: generateErrorHandlingDetails.retry(),
    [DeviceAppErrorType.DEVICE_SETUP_REQUIRED]:
      generateErrorHandlingDetails.toOnboarding(lang.strings.buttons.continue),
    [DeviceAppErrorType.WALLET_NOT_FOUND]:
      generateErrorHandlingDetails.walletDoesNotExistOnDevice(),
    [DeviceAppErrorType.WALLET_PARTIAL_STATE]:
      generateErrorHandlingDetails.retry(),
    [DeviceAppErrorType.APP_TIMEOUT]: generateErrorHandlingDetails.retry(),
    [DeviceAppErrorType.CARD_OPERATION_FAILED]:
      generateErrorHandlingDetails.retryWithHelp('cardError'),
    [DeviceAppErrorType.USER_REJECTION]: generateErrorHandlingDetails.retry(),
    [DeviceAppErrorType.CORRUPT_DATA]:
      generateErrorHandlingDetails.retryWithReport(),
    [DeviceAppErrorType.DEVICE_AUTH_FAILED]:
      generateErrorHandlingDetails.report(),
    [DeviceAppErrorType.CARD_AUTH_FAILED]:
      generateErrorHandlingDetails.report(),

    // Card Errors
    [CardAppErrorType.UNKNOWN]: generateErrorHandlingDetails.retryWithReport(),
    [CardAppErrorType.NOT_PAIRED]: generateErrorHandlingDetails.retry(),
    [CardAppErrorType.SW_INCOMPATIBLE_APPLET]:
      generateErrorHandlingDetails.retryWithReport(),
    [CardAppErrorType.SW_NULL_POINTER_EXCEPTION]:
      generateErrorHandlingDetails.retryWithHelp('nullPointer'),
    [CardAppErrorType.SW_TRANSACTION_EXCEPTION]:
      generateErrorHandlingDetails.retryWithHelp('txnException'),
    [CardAppErrorType.SW_FILE_INVALID]: generateErrorHandlingDetails.retry(),
    [CardAppErrorType.SW_SECURITY_CONDITIONS_NOT_SATISFIED]:
      generateErrorHandlingDetails.retryWithReport(),
    [CardAppErrorType.SW_CONDITIONS_NOT_SATISFIED]:
      generateErrorHandlingDetails.retry(),
    [CardAppErrorType.SW_WRONG_DATA]:
      generateErrorHandlingDetails.retryWithReport(),
    [CardAppErrorType.SW_FILE_NOT_FOUND]: generateErrorHandlingDetails.report(),
    [CardAppErrorType.SW_RECORD_NOT_FOUND]:
      generateErrorHandlingDetails.retry(),
    [CardAppErrorType.SW_FILE_FULL]: generateErrorHandlingDetails.retry(),
    [CardAppErrorType.SW_CORRECT_LENGTH_00]:
      generateErrorHandlingDetails.retry(),
    [CardAppErrorType.SW_INVALID_INS]: generateErrorHandlingDetails.report(),
    [CardAppErrorType.SW_NOT_PAIRED]: generateErrorHandlingDetails.retry(),
    [CardAppErrorType.SW_CRYPTO_EXCEPTION]:
      generateErrorHandlingDetails.report(),
    [CardAppErrorType.POW_SW_WALLET_LOCKED]:
      generateErrorHandlingDetails.retry(),
    [CardAppErrorType.SW_INS_BLOCKED]:
      generateErrorHandlingDetails.help('insBlocked'),
    [CardAppErrorType.SW_OUT_OF_BOUNDARY]:
      generateErrorHandlingDetails.help('cardOutOfBoundary'),
    [CardAppErrorType.UNRECOGNIZED]:
      generateErrorHandlingDetails.retryWithHelp('cardError'),

    // Manager App Errors
    [GetLogsErrorType.LOGS_DISABLED]: generateErrorHandlingDetails.retry(),
  };

  return deviceErrorHandlingDetailsMap[errorCode];
};
