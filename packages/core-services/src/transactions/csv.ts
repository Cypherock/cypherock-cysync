import {
  createCSVFromObject,
  formatDateToUTCString,
} from '@cypherock/cysync-utils';

export const createCSVFromTransactions = (
  transactions: {
    date: number;
    type: string;
    currency: string;
    amount: string;
    feeCurrency: string;
    feeAmount: string;
    hash: string;
    walletName: string;
    accountName: string;
    xpub: string;
    countervalueCurrency: string;
    countervalueAmount: string;
    remarks: string;
    network: string;
  }[],
) =>
  createCSVFromObject({
    headers: [
      { name: 'Date (UTC)', key: 'date' },
      { name: 'Type', key: 'type' },
      { name: 'Base Currency', key: 'currency' },
      { name: 'Base Amount', key: 'amount' },
      { name: 'Fee Currency', key: 'feeCurrency' },
      { name: 'Fee Amount', key: 'feeAmount' },
      { name: 'Transaction Hash', key: 'hash' },
      { name: 'Wallet Name', key: 'walletName' },
      { name: 'Network', key: 'network' },
      { name: 'Account Name', key: 'accountName' },
      { name: 'Account xpub', key: 'xpub' },
      { name: 'Countervalue Currency', key: 'countervalueCurrency' },
      { name: 'Countervalue at CSV Export', key: 'countervalueAmount' },
      { name: 'Remarks', key: 'remarks' },
    ],
    rows: transactions.map(t => ({
      date: formatDateToUTCString(t.date),
      type: t.type,
      currency: t.currency,
      amount: t.amount,
      feeCurrency: t.feeCurrency,
      feeAmount: t.feeAmount,
      hash: t.hash,
      walletName: t.walletName,
      accountName: t.accountName,
      xpub: t.xpub,
      countervalueCurrency: t.countervalueCurrency,
      countervalueAmount: t.countervalueAmount,
      remarks: t.remarks,
      network: t.network,
    })),
  });

export const createCSVFromSwap = (
  transactions: {
    date: number;
    provider: string;
    providerUrl: string;
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    assetToAmount: string;
    status: string;
    walletFrom: string;
    accountFrom: string;
    walletTo: string;
    accountTo: string;
    swapId: string;
    sentTransactionHash: string;
    receiveTransactionHash?: string;
  }[],
) =>
  createCSVFromObject({
    headers: [
      { name: 'Date (UTC)', key: 'date' },
      { name: 'Provider', key: 'provider' },
      { name: 'Provider URL', key: 'providerUrl' },
      { name: 'Asset From', key: 'assetFrom' },
      { name: 'Amount From', key: 'assetFromAmount' },
      { name: 'Asset To', key: 'assetTo' },
      { name: 'Amount To', key: 'assetToAmount' },
      { name: 'Status', key: 'status' },
      { name: 'Wallet From', key: 'walletFrom' },
      { name: 'Account From', key: 'accountFrom' },
      { name: 'Wallet To', key: 'walletTo' },
      { name: 'Account To', key: 'accountTo' },
      { name: 'ExchangeId', key: 'exchangeId' },
      { name: 'Sent Transaction Hash', key: 'sentTransactionHash' },
      { name: 'Receive Transaction Hash', key: 'receiveTransactionHash' },
    ],
    rows: transactions.map(t => ({
      date: formatDateToUTCString(t.date),
      provider: t.provider,
      providerUrl: t.providerUrl,
      assetFrom: t.assetFrom,
      assetFromAmount: t.assetFromAmount,
      assetTo: t.assetTo,
      assetToAmount: t.assetToAmount,
      status: t.status,
      walletFrom: t.walletFrom,
      accountFrom: t.accountFrom,
      walletTo: t.walletTo,
      accountTo: t.accountTo,
      exchangeId: t.swapId,
      sentTransactionHash: t.sentTransactionHash,
      receiveTransactionHash: t.receiveTransactionHash,
    })),
  });
