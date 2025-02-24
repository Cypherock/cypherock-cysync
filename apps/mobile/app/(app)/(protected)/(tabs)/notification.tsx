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
import { CoinIcon } from '@/components/core';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { useNavigation } from 'expo-router';

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
}) => {
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
      );
    }

    return parseLangTemplate(lang.strings.notifications.sendTransaction, vars);
  }

  const receiveStr = parseLangTemplate(
    lang.strings.notifications.receiveTransaction,
    vars,
  );

  if (account?.derivationScheme) {
    return `${receiveStr} [${account.derivationScheme.toUpperCase()}]`;
  }

  return receiveStr;
};

export default function Notification() {
  const { transactions, lang, wallets, accounts, unreadTransactions } =
    useAppSelector(selector);
  const navigation = useNavigation();

  const onNotificationClick = (t: ITransaction) => {
    markTransactionNotificationClicked(t);
  };

  const displayTransactions = useMemo(() => {
    const formattedTxns = transactions.map(
      t => ({
        id: t.__id ?? '',
        icon: (
          <CoinIcon
            parentAssetId={t.parentAssetId}
            assetId={t.assetId}
            size={12}
          />
        ),
        title: getDisplayTransactionType(t, lang.strings),
        status: t.status,
        time: formatDate(t.timestamp, 'h:mm a'),
        txn: t,
        type: t.type,
        info: getNotificationText({
          txn: t,
          lang,
          wallets,
          accounts,
        }) as string,
      }),
      [transactions],
    );

    const newList: {
      title: string;
      data: (typeof formattedTxns)[0][];
    }[] = [];

    const groupedList = lodash.groupBy(formattedTxns, t =>
      formatDate(t.txn.timestamp, 'eeee, MMMM d yyyy'),
    );

    for (const [date, groupItems] of Object.entries(groupedList)) {
      newList.push({ title: date, data: [...groupItems] });
    }

    return newList;
  }, [transactions]);

  useEffect(() => {
    navigation.setOptions({
      showDiscard: true,
    });
  }, []);

  return (
    <ScreenContainer>
      {displayTransactions.length === 0 ? (
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
          sections={displayTransactions}
          renderItem={({ item }) => (
            <NotificationItem
              {...item}
              isClicked={item.txn?.isClicked}
              type={item.type as any}
              onPress={() => onNotificationClick(item.txn)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Card style={{ marginTop: 16, paddingVertical: 4 }}>
              <Typography type="para">{title}</Typography>
            </Card>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </ScreenContainer>
  );
}
