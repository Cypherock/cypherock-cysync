/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  IPreparedTransaction,
  IReceiveEvent,
  IReceiveParams,
  IValidateAddressParams,
  ISignTransactionEvent,
  ISyncPricesParams,
  ISyncPriceHistoriesParams,
  IGetCoinAllocationsParams,
  IGetAccountHistoryParams,
  IGetExplorerLink,
  IInitializeTransactionParams,
  ISyncAccountsParams,
  ISignMessageEvent,
  ISignMessageParams,
  IFormatAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import {
  ethersLibType,
  setEthersLib,
  setEip712Lib,
} from '@cypherock/sdk-app-evm';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  ICreateEvmAccountParams,
  IPrepareEvmTransactionParams,
  ISignEvmTransactionParams,
  IBroadcastEvmTransactionParams,
} from './operations/types';
import { setCoinSupportEthersLib } from './utils';
import { setCoinSupportWeb3Lib } from './utils/web3';

export * from './operations/types';
export * from './services';

export { updateLogger } from './utils/logger';

export class EvmSupport implements CoinSupport {
  public static setEthersLibrary(ethers: ethersLibType): void {
    setEthersLib(ethers);
    setCoinSupportEthersLib(ethers);
  }

  public static setEip712Library(eip712: any): void {
    setEip712Lib(eip712);
  }

  public static setWeb3Library(web3: any): void {
    setCoinSupportWeb3Lib(web3);
  }

  public receive(params: IReceiveParams): Observable<IReceiveEvent> {
    return operations.receive(params);
  }

  public createAccounts(params: ICreateEvmAccountParams) {
    return operations.createAccounts(params);
  }

  public syncAccount(params: ISyncAccountsParams) {
    return operations.syncAccount(params);
  }

  public async initializeTransaction(
    params: IInitializeTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.initializeTransaction(params);
  }

  public async prepareTransaction(
    params: IPrepareEvmTransactionParams,
  ): Promise<IPreparedTransaction> {
    return operations.prepareTransaction(params);
  }

  public signTransaction(
    params: ISignEvmTransactionParams,
  ): Observable<ISignTransactionEvent> {
    return operations.signTransaction(params);
  }

  public signMessage(
    params: ISignMessageParams,
  ): Observable<ISignMessageEvent> {
    return operations.sign(params);
  }

  public broadcastTransaction(
    params: IBroadcastEvmTransactionParams,
  ): Promise<ITransaction> {
    return operations.broadcastTransaction(params);
  }

  public getCoinAllocations(params: IGetCoinAllocationsParams) {
    return operations.getCoinAllocations(params);
  }

  public getAccountHistory(params: IGetAccountHistoryParams) {
    return operations.getAccountHistory(params);
  }

  public validateAddress(params: IValidateAddressParams) {
    return operations.validateAddress(params);
  }

  public syncPrices(params: ISyncPricesParams) {
    return operations.syncPrices(params);
  }

  public syncPriceHistories(params: ISyncPriceHistoriesParams) {
    return operations.syncPriceHistories(params);
  }

  public getExplorerLink(params: IGetExplorerLink) {
    return operations.getExplorerLink(params);
  }

  public formatAddress(params: IFormatAddressParams) {
    return operations.formatAddress(params);
  }
}
