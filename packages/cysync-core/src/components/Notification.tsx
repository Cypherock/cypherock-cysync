import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import {
  parseLangTemplate,
  Button,
  Container,
  Flex,
  LangDisplay,
  NotificationContainer,
  NotificationGroupHeader,
  NotificationItem,
  Typography,
} from '@cypherock/cysync-ui';
import {
  IAccount,
  ITransaction,
  IWallet,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useMemo } from 'react';

import { openHistoryDialog } from '~/actions';
import { useNavigateTo } from '~/hooks';
import { transactionIconMap, getDisplayTransactionType } from '~/utils';

import {
  CoinIcon,
  ILangState,
  routes,
  selectAccounts,
  selectLanguage,
  selectNotifications,
  selectWallets,
  toggleNotification,
  useAppDispatch,
  useAppSelector,
} from '..';

export interface NotificationProps {
  top?: number;
}

const selector = createSelector(
  [selectLanguage, selectNotifications, selectWallets, selectAccounts],
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
        lang.strings.topbar.notification.sendTransactionMultiple,
        vars,
      );
    }

    return parseLangTemplate(
      lang.strings.topbar.notification.sendTransaction,
      vars,
    );
  }

  const receiveStr = parseLangTemplate(
    lang.strings.topbar.notification.receiveTransaction,
    vars,
  );

  if (account?.derivationScheme) {
    return `${receiveStr} [${account.derivationScheme.toUpperCase()}]`;
  }

  return receiveStr;
};

export const NotificationDisplay: React.FC<NotificationProps> = ({ top }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateTo();
  const { transactions, lang, hasMoreTransactions, wallets, accounts } =
    useAppSelector(selector);

  const onClose = () => {
    dispatch(toggleNotification());
  };

  const onShowMoreClick = () => {
    onClose();
    navigate(routes.history.path);
  };

  const onNotificationClick = (t: ITransaction) => {
    dispatch(openHistoryDialog({ txn: t }));
  };

  const displayTransactions = useMemo(() => {
    const formattedTxns = transactions.map(t => ({
      id: t.__id ?? '',
      icon: transactionIconMap[TransactionTypeMap.receive],
      title: getDisplayTransactionType(t, lang.strings),
      status: TransactionStatusMap.success,
      description: (
        <Container display="inline-block">
          <CoinIcon
            parentAssetId={t.parentAssetId}
            assetId={t.assetId}
            size="12px"
            containerProps={{ display: 'inline' }}
          />

          <Typography
            color="muted"
            $fontSize={14}
            ml={1}
            display="inline"
            $wordBreak="break-word"
          >
            {getNotificationText({ txn: t, lang, wallets, accounts })}
          </Typography>
        </Container>
      ),
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

  return (
    <NotificationContainer onClose={onClose} top={top}>
      {displayTransactions.length <= 0 && (
        <Flex direction="column" align="center" px={5}>
          <Typography
            $fontSize={20}
            $fontWeight="medium"
            $wordBreak="break-all"
            $textAlign="center"
          >
            <LangDisplay
              text={lang.strings.topbar.notification.noTransactions.title}
            />
          </Typography>
          <Typography $fontSize={16} color="muted" $textAlign="center">
            <LangDisplay
              text={lang.strings.topbar.notification.noTransactions.subTitle}
            />
          </Typography>
        </Flex>
      )}
      {displayTransactions.map((t, index) => {
        if (t.isGroupHeader) {
          return (
            <NotificationGroupHeader
              key={t.id}
              text={t.groupText ?? ''}
              mb={index === displayTransactions.length - 1 ? 0 : '24px'}
            />
          );
        }

        return (
          <NotificationItem
            {...t}
            key={t.id}
            mb={index === displayTransactions.length - 1 ? 0 : '24px'}
            onClick={() => onNotificationClick(t.txn)}
          />
        );
      })}
      {hasMoreTransactions && (
        <Container width="100%" px="40px" mt="24px">
          <Button
            variant="text"
            onClick={onShowMoreClick}
            width="100%"
            justify="center"
          >
            <Typography color="muted" $fontSize={16} $textAlign="center">
              <LangDisplay text={lang.strings.buttons.showMore} />
            </Typography>
          </Button>
        </Container>
      )}
    </NotificationContainer>
  );
};

export const Notification: React.FC<NotificationProps> = props => {
  const isOpen = useAppSelector(state => state.notification.isOpen);

  if (!isOpen) {
    return null;
  }

  return <NotificationDisplay {...props} />;
};

const defaultProps = {
  top: undefined,
};

Notification.defaultProps = defaultProps;
NotificationDisplay.defaultProps = defaultProps;
