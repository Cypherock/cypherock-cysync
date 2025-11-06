import {
  ISignTransactionParams,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';

export type ISignCantonExternalPartyTransactionParams = ISignTransactionParams;

export type ISignCantonExternalPartyTransactionEvent =
  ISignTransactionEvent<string>;
