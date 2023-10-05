import { getParsedAmount, getDefaultUnit } from '@cypherock/coin-support-utils';
import {
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
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useMemo } from 'react';

import { useNavigateTo } from '~/hooks';
import {
  transactionIconMap,
  getDisplayTransactionType,
  getTransactionTypeToStringMap,
} from '~/utils';

import {
  CoinIcon,
  routes,
  selectLanguage,
  selectNotifications,
  toggleNotification,
  useAppDispatch,
  useAppSelector,
} from '..';

export interface NotificationProps {
  top?: number;
}

const selector = createSelector(
  [selectLanguage, selectNotifications],
  (lang, notifications) => ({
    lang,
    ...notifications,
  }),
);

export const NotificationDisplay: React.FC<NotificationProps> = ({ top }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateTo();
  const { transactions, lang, hasMoreTransactions } = useAppSelector(selector);

  const onNotificationClick = () => {
    dispatch(toggleNotification());
  };

  const onShowMoreClick = () => {
    navigate(routes.history.path);
  };

  const displayTransactions = useMemo(() => {
    const formattedTxns = transactions.map(t => {
      const { amount, unit } = getParsedAmount({
        coinId: t.parentAssetId,
        assetId: t.assetId,
        unitAbbr: getDefaultUnit(t.parentAssetId, t.assetId).abbr,
        amount: t.amount,
      });

      return {
        id: t.__id ?? '',
        icon: transactionIconMap[TransactionTypeMap.receive],
        title: getDisplayTransactionType(t, lang.strings),
        status: TransactionStatusMap.success,
        description: (
          <Container>
            <CoinIcon
              parentAssetId={t.parentAssetId}
              assetId={t.assetId}
              size="12px"
            />

            <Typography color="muted" $fontSize={14} ml={1}>
              {`${amount} ${unit.abbr} ${getTransactionTypeToStringMap(
                lang.strings,
              )[t.type].toLowerCase()}`}
            </Typography>
          </Container>
        ),
        time: formatDate(t.timestamp, 'h:mm a'),
        txn: t,
      };
    });

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
    <NotificationContainer onClose={onNotificationClick} top={top}>
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
