/* eslint-disable class-methods-use-this */
import * as operations from './operations';
import {
  IInheritanceDecryptMessageParams,
  IInheritanceEncryptMessageParams,
  IInheritanceStartSessionParams,
  IInheritanceStopSessionParams,
  IInheritanceWalletAuthParams,
} from './operations/types';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class InheritanceSupport {
  public walletAuth(params: IInheritanceWalletAuthParams) {
    return operations.walletAuth(params);
  }

  public encryptMessageWithPin(params: IInheritanceEncryptMessageParams) {
    return operations.encryptMessage(params);
  }

  public decryptMessageWithPin(params: IInheritanceDecryptMessageParams) {
    return operations.decryptMessage(params);
  }

  public startSession(params: IInheritanceStartSessionParams) {
    return operations.startSession(params);
  }

  public stopSession(params: IInheritanceStopSessionParams) {
    return operations.stopSession(params);
  }
}
