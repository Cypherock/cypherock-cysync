import { IXrpCoinInfo } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import { IUnsignedTransaction } from '@cypherock/sdk-app-xrp';

import * as services from '../../services';
import { getCoinSupportXrpLib } from '../../utils';
import { IPreparedXrpTransaction } from '../transaction';

export const prepareUnsignedTxn = async (
  transaction: IPreparedXrpTransaction,
  coin: IXrpCoinInfo,
  account: IAccount,
): Promise<IUnsignedTransaction> => {
  const xrpl = getCoinSupportXrpLib();
  const address = xrpl.deriveAddress(account.xpubOrAddress);

  const { flags, sequence } = await services.getFlagsAndSequence(
    address,
    account.assetId,
  );
  const lastLedgerSequence = await services.getLastLedgerSequence(
    account.assetId,
  );

  const rawTxn = {
    Account: address,
    Destination: transaction.computedData.output.address,
    Amount: transaction.computedData.output.amount,
    Fee: transaction.computedData.fees,
    DestinationTag: transaction.computedData.output.destinationTag,
    Flags: flags,
    Sequence: sequence,
    LastLedgerSequence: lastLedgerSequence,
    SigningPubKey: account.xpubOrAddress,
  };
  const txnHex = xrpl.encodeForSigning({
    ...rawTxn,
    TransactionType: 'Payment',
  });

  const unsignedTxn: IUnsignedTransaction = {
    txnHex,
    rawTxn: {
      ...rawTxn,
      TransactionType: 'Payment',
    },
  };

  return unsignedTxn;
};
