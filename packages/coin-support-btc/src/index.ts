/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  ICreateTransactionParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { setBitcoinJSLib, bitcoinJsLibType } from '@cypherock/sdk-app-btc';

import * as operations from './operations';
import { ISyncBtcAccountsParams } from './operations/syncAccount/types';
import {
  IBtcReceiveParams,
  ICreateBtcAccountParams,
  IPrepareBtcTransactionParams,
} from './operations/types';

export * from './operations/types';
export * from './services';
export { updateLogger } from './utils/logger';

export class BtcSupport implements CoinSupport {
  static setBitcoinLibrary(btcLib: bitcoinJsLibType) {
    setBitcoinJSLib(btcLib);
  }

  public createAccounts(params: ICreateBtcAccountParams) {
    return operations.createAccounts(params);
  }

  public receive(params: IBtcReceiveParams) {
    return operations.receive(params);
  }

  public syncAccounts(params: ISyncBtcAccountsParams) {
    return operations.syncAccount(params);
  }

  public createTransaction(params: ICreateTransactionParams) {
    return operations.createTransaction(params);
  }

  public async prepareTransaction(params: IPrepareBtcTransactionParams) {
    return operations.prepareTransaction(params);
  }

  public validateAddress(params: IValidateAddressParams) {
    return operations.validateAddress(params);
  }
}
