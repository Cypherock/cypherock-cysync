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
      { name: 'Account Name', key: 'accountName' },
      { name: 'Account xpub', key: 'xpub' },
      { name: 'Countervalue Currency', key: 'countervalueCurrency' },
      { name: 'Countervalue at CSV Export', key: 'countervalueAmount' },
      { name: 'Network', key: 'network' },
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
      network: t.network,
    })),
  });
