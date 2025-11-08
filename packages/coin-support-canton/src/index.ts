/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  ICreateAccountEvent,
  ICreateAccountParams,
  IFormatAddressParams,
  IGetAccountAddressParams,
  IGetAccountHistoryParams,
  IGetAccountHistoryResult,
  IGetCoinAllocationsParams,
  IGetCoinAllocationsResult,
  IGetExplorerLink,
  IInitializeTransactionParams,
  IReceiveEvent,
  IReceiveParams,
  ISignMessageEvent,
  ISignMessageParams,
  ISignTransactionParams,
  ISyncAccountsParams,
  ISyncPriceHistoriesParams,
  ISyncPricesParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { CantonLib, setCantonLib } from '@cypherock/sdk-app-canton';
import { Observable } from 'rxjs';

import * as operations from './operations';
import {
  IBroadcastCantonChoiceTransactionParams,
  IBroadcastCantonExternalPartyTransactionParams,
  IBroadcastCantonTransactionParams,
  IBroadcastCantonTransferPreApprovalTransactionParams,
  IBroadcastCantonMergeDelegationProposalTransactionParams,
  IPrepareCantonChoiceTransactionParams,
  IPrepareCantonExternalPartyTransactionParams,
  IPrepareCantonTransactionParams,
  IPrepareCantonTransferPreApprovalTransactionParams,
  IPrepareCantonMergeDelegationProposalTransactionParams,
  IPreparedCantonExternalPartyTransaction,
  IPreparedCantonTransaction,
  IPreparedCantonTransferPreApprovalTransaction,
  IPreparedCantonMergeDelegationProposalTransaction,
  ISignCantonExternalPartyTransactionEvent,
  ISignCantonExternalPartyTransactionParams,
  ISignCantonTransactionEvent,
} from './operations/types';
import { getAppletId } from './utils';

export * from './operations/types';
export { updateLogger } from './utils/logger';

export class CantonSupport implements CoinSupport {
  public static setCantonLib(cantonlib: CantonLib): void {
    setCantonLib(cantonlib);
  }

  public receive(params: IReceiveParams): Observable<IReceiveEvent> {
    return operations.receive(params);
  }

  public createAccounts(
    params: ICreateAccountParams,
  ): Observable<ICreateAccountEvent> {
    return operations.createAccounts(params);
  }

  public syncAccount(params: ISyncAccountsParams): Observable<void> {
    return operations.syncAccount(params);
  }

  public async initializeTransaction(
    params: IInitializeTransactionParams,
  ): Promise<IPreparedCantonTransaction> {
    return operations.initializeTransaction(params);
  }

  public async prepareTransaction(
    params: IPrepareCantonTransactionParams,
  ): Promise<IPreparedCantonTransaction> {
    return operations.prepareTransaction(params);
  }

  public async prepareChoiceTransaction(
    params: IPrepareCantonChoiceTransactionParams,
  ): Promise<IPreparedCantonTransaction> {
    return operations.prepareChoiceTransaction(params);
  }

  public async prepareTransferPreApprovalTransaction(
    params: IPrepareCantonTransferPreApprovalTransactionParams,
  ): Promise<IPreparedCantonTransferPreApprovalTransaction> {
    return operations.prepareTransferPreApprovalTransaction(params);
  }

  public async prepareExternalPartyTransaction(
    params: IPrepareCantonExternalPartyTransactionParams,
  ): Promise<IPreparedCantonExternalPartyTransaction> {
    return operations.prepareExternalPartyTransaction(params);
  }

  public async prepareMergeDelegationProposalTransaction(
    params: IPrepareCantonMergeDelegationProposalTransactionParams,
  ): Promise<IPreparedCantonMergeDelegationProposalTransaction> {
    return operations.prepareMergeDelegationProposalTransaction(params);
  }

  public signTransaction(
    params: ISignTransactionParams,
  ): Observable<ISignCantonTransactionEvent> {
    return operations.signTransaction(params);
  }

  public signExternalPartyTransaction(
    params: ISignCantonExternalPartyTransactionParams,
  ): Observable<ISignCantonExternalPartyTransactionEvent> {
    return operations.signExternalPartyTransaction(params);
  }

  public broadcastTransaction(
    params: IBroadcastCantonTransactionParams,
  ): Promise<ITransaction> {
    return operations.broadcastTransaction(params);
  }

  public broadcastChoiceTransaction(
    params: IBroadcastCantonChoiceTransactionParams,
  ): Promise<void> {
    return operations.broadcastChoiceTransaction(params);
  }

  public broadcastExternalPartyTransaction(
    params: IBroadcastCantonExternalPartyTransactionParams,
  ): Promise<void> {
    return operations.broadcastExternalPartyTransaction(params);
  }

  public broadcastTransferPreApprovalTransaction(
    params: IBroadcastCantonTransferPreApprovalTransactionParams,
  ): Promise<void> {
    return operations.broadcastTransferPreApprovalTransaction(params);
  }

  public broadcastMergeDelegationProposalTransaction(
    params: IBroadcastCantonMergeDelegationProposalTransactionParams,
  ): Promise<void> {
    return operations.broadcastMergeDelegationProposalTransaction(params);
  }

  public signMessage(
    params: ISignMessageParams,
  ): Observable<ISignMessageEvent> {
    throw new Error(`Method not implemented Params: ${params}`);
  }

  public getCoinAllocations(
    params: IGetCoinAllocationsParams,
  ): Promise<IGetCoinAllocationsResult> {
    return operations.getCoinAllocations(params);
  }

  public getAccountHistory(
    params: IGetAccountHistoryParams,
  ): Promise<IGetAccountHistoryResult> {
    return operations.getAccountHistory(params);
  }

  public validateAddress(params: IValidateAddressParams): boolean {
    return operations.validateAddress(params);
  }

  public syncPrices(params: ISyncPricesParams): Observable<void> {
    return operations.syncPrices(params);
  }

  public syncPriceHistories(
    params: ISyncPriceHistoriesParams,
  ): Observable<void> {
    return operations.syncPriceHistories(params);
  }

  public getExplorerLink(params: IGetExplorerLink): string {
    return operations.getExplorerLink(params);
  }

  public formatAddress(params: IFormatAddressParams): string {
    return params.address;
  }

  public async getAccountAddress(params: IGetAccountAddressParams) {
    return (await operations.getExternalAddress(params)).address;
  }

  public getAppId() {
    return getAppletId();
  }
}
