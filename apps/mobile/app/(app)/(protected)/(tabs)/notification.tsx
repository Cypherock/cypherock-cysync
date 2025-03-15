import React, { useEffect, useMemo } from 'react';
import {
  Card,
  NotificationItem,
  parseLangTemplate,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { SectionList } from 'react-native';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import {
  ILangState,
  selectLanguage,
  selectNotifications,
  selectUnHiddenAccounts,
  selectWallets,
  useAppSelector,
} from '@/store';
import { createSelector } from '@reduxjs/toolkit';
import { markTransactionNotificationClicked } from '@/actions';
import {
  IAccount,
  ITransaction,
  IWallet,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { getDisplayTransactionType } from '@/utils/transactions';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { useNavigation } from 'expo-router';
import { useHistoryContext } from '@/contexts/useHistoryContext';
import { TransactionRowData, useTransactions } from '@/hooks';
import { router } from 'expo-router';

const selector = createSelector(
  [selectLanguage, selectNotifications, selectWallets, selectUnHiddenAccounts],
  (lang, notifications, { wallets }, { accounts }) => ({
    lang,
    wallets,
    accounts,
    ...notifications,
  }),
);

const getNotificationText = (params: {
  txn: ITransaction;
  wallets: IWallet[];
  accounts: IAccount[];
  lang: ILangState;
}): string => {
  const { txn, wallets, accounts, lang } = params;

  const { amount, unit } = getParsedAmount({
    coinId: txn.parentAssetId,
    assetId: txn.assetId,
    unitAbbr: getDefaultUnit(txn.parentAssetId, txn.assetId).abbr,
    amount: txn.amount,
  });

  const account = accounts.find(
    a =>
      (txn.parentAccountId && a.__id === txn.parentAccountId) ||
      txn.accountId === a.__id,
  );

  const vars = {
    amount,
    unit: unit.abbr,
    address: txn.outputs[0]?.address,
    walletName: wallets.find(w => w.__id === txn.walletId)?.name,
    accountName: account?.name,
    type: getDisplayTransactionType(txn, lang.strings).toLowerCase(),
  };

  if (txn.type === TransactionTypeMap.send) {
    if (txn.outputs.length > 1) {
      return parseLangTemplate(
        lang.strings.notifications.sendTransactionMultiple,
        vars,
      ) as string;
    }

    return parseLangTemplate(
      lang.strings.notifications.sendTransaction,
      vars,
    ) as string;
  }

  const receiveStr = parseLangTemplate(
    lang.strings.notifications.receiveTransaction,
    vars,
  ) as string;

  if (account?.derivationScheme) {
    return `${receiveStr} [${account.derivationScheme.toUpperCase()}]`;
  }

  return receiveStr;
};

export default function Notification() {
  const { lang, wallets, accounts } = useAppSelector(selector);
  const { displayedData: transactions } = useTransactions();
  const { setSelectedTransaction, setFrom } = useHistoryContext();
  const navigation = useNavigation();

  const onNotificationClick = (t: TransactionRowData) => {
    setSelectedTransaction(t);
    setFrom('/notification');
    markTransactionNotificationClicked(t.txn);
  };

  useEffect(() => {
    navigation.setOptions({
      showDiscard: true,
    });
  }, []);

  const renderNotification = (item: TransactionRowData) => {
    return (
      <NotificationItem
        isClicked={(item.txn as any).isClicked}
        type={item.type as any}
        onPress={() => onNotificationClick(item)}
        status={item.status}
        icon={<item.assetIcon size={12} />}
        info={getNotificationText({
          txn: item.txn,
          lang,
          accounts,
          wallets,
        })}
        time={item.time}
      />
    );
  };

  return (
    <ScreenContainer>
      {transactions.length === 0 ? (
        <NoDataScreen
          title={lang.strings.notifications.noTransactions.title}
          description={lang.strings.notifications.noTransactions.subTitle}
        />
      ) : (
        <SectionList
          style={{
            flex: 1,
            width: '100%',
            paddingHorizontal: 16,
            paddingBottom: 16,
            overflow: 'hidden',
          }}
          sections={transactions}
          renderItem={({ item }: { item: TransactionRowData }) =>
            renderNotification(item)
          }
          renderSectionHeader={({ section: { title } }) => (
            <Card style={{ marginTop: 16, paddingVertical: 4 }}>
              <Typography type="para">{title}</Typography>
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}
