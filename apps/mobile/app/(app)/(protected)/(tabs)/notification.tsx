import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Container,
  NotificationItem,
  parseLangTemplate,
  ScreenContainer,
  TransactionType,
  Typography,
} from '@/components/ui';
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
import {
  markAllTransactionNotificationRead,
  markTransactionNotificationClicked,
} from '@/actions';
import {
  IAccount,
  ITransaction,
  IWallet,
  TransactionStatus,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { getDisplayTransactionType } from '@/utils/transactions';
import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { router, useNavigation } from 'expo-router';
import { useHistoryContext } from '@/contexts/useHistoryContext';
import { useTransactions } from '@/hooks';
import { FlashList } from '@shopify/flash-list';
import { TouchableOpacity } from 'react-native';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import { CoinIcon } from '@/components/core';

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

interface NotificationRowData {
  isGroupHeader?: boolean;
  groupText?: string;
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  time: string;
  txn: ITransaction;
  assetIcon: React.JSX.Element;
}

const MAX_NOTIFICATIONS_TO_SHOW = 15;

export default function Notification() {
  const { lang, wallets, accounts, transactions, unreadTransactions } =
    useAppSelector(selector);
  const { displayedData } = useTransactions();
  const { setSelectedTransaction, setFrom } = useHistoryContext();
  const navigation = useNavigation();
  const [notificationClicked, setNotificationClicked] = useState(false);

  const handleShowMore = () => {
    router.push('/history');
  };

  const onClose = () => {
    if (notificationClicked || unreadTransactions == 0) return;
    markAllTransactionNotificationRead(transactions);
  };

  const onNotificationClick = (t: NotificationRowData) => {
    const transaction = displayedData.find(p => p.id === t.id);
    setSelectedTransaction(transaction);
    setFrom('/notification');
    setNotificationClicked(true);
    markTransactionNotificationClicked(t.txn);
  };

  const displayTransactions = useMemo(() => {
    const formattedTxns = transactions
      .slice(0, Math.min(unreadTransactions, MAX_NOTIFICATIONS_TO_SHOW))
      .map(t => ({
        id: t.__id ?? '',
        type: t.type as TransactionType,
        title: getDisplayTransactionType(t, lang.strings),
        status: t.status,
        assetIcon: (
          <CoinIcon
            parentAssetId={t.parentAssetId}
            assetId={t.assetId}
            size={12}
          />
        ),
        description: getNotificationText({ txn: t, lang, wallets, accounts }),
        time: formatDate(t.timestamp, 'h:mm a'),
        txn: t,
      }));

    const groupedList = lodash.groupBy(formattedTxns, t =>
      formatDate(t.txn.timestamp, 'eeee, MMMM d yyyy'),
    );

    const newList: ((typeof formattedTxns)[0] & {
      isGroupHeader?: boolean;
      groupText?: string;
      id: string;
    })[] = [];

    for (const [date, groupItems] of Object.entries(groupedList)) {
      newList.push({ isGroupHeader: true, groupText: date, id: date } as any);
      newList.push(...groupItems);
    }

    return newList;
  }, [transactions]);

  useEffect(() => {
    setNotificationClicked(false);
    navigation.setOptions({
      showDiscard: true,
    });
  }, []);

  const renderNotification = (item: NotificationRowData) => {
    if (item.isGroupHeader) {
      return (
        <Card style={{ marginTop: 16, paddingVertical: 4 }}>
          <Typography type="para">{item.groupText}</Typography>
        </Card>
      );
    }

    return (
      <NotificationItem
        isClicked={(item.txn as any).isClicked}
        type={item.type}
        onPress={() => onNotificationClick(item)}
        status={item.status}
        icon={item.assetIcon}
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', onClose);
    return unsubscribe;
  }, [navigation, notificationClicked, transactions]);

  return (
    <ScreenContainer>
      {transactions.length === 0 ||
      displayedData.length === 0 ||
      unreadTransactions === 0 ? (
        <NoDataScreen
          title={lang.strings.notifications.noTransactions.title}
          description={lang.strings.notifications.noTransactions.subTitle}
        />
      ) : (
        <Container
          style={{
            flex: 1,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <FlashList
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}
            estimatedItemSize={51}
            data={displayTransactions}
            renderItem={({ item }) => renderNotification(item)}
            getItemType={item => {
              return item.isGroupHeader ? 'sectionHeader' : 'row';
            }}
            ListFooterComponent={
              <TouchableOpacity
                onPress={handleShowMore}
                style={{ marginTop: 16 }}
              >
                <Card>
                  <Typography type="h4" color="secondary">
                    Show More
                  </Typography>
                </Card>
              </TouchableOpacity>
            }
          />
        </Container>
      )}
    </ScreenContainer>
  );
}
