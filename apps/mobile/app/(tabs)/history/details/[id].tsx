import { View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Copy, Flex, ScreenContainer, Tag, Typography } from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import * as Clipboard from 'expo-clipboard';
import { getDB } from '@/utils';
import {
  TransactionType,
  ITransactionInputOutput,
  TransactionStatus,
} from '@cypherock/db-interfaces';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';

interface ISender {
  address: string;
  tag?: boolean;
}

interface IDetails {
  value: string;
  fee: string;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
  wallet: string;
  account: string;
  asset: string;
  sender: ISender[];
  receiver: ISender[];
}

export default function Index() {
  const { strings } = useAppSelector(selectLanguage);
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [copied, setCopied] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<IDetails | undefined>();

  useEffect(() => {
    if (!transaction) return;
    navigation.setOptions({
      title:
        transaction.type === 'send'
          ? strings.history.details.heading.sent
          : strings.history.details.heading.received,
    });
  }, []);

  useEffect(() => {
    async function getTransactionData() {
      const db = getDB();
      const data = await db.transaction.getOne({
        __id: typeof id === 'string' ? id : id[0],
      });
      if (data) {
        const formattedTransaction: IDetails = {
          value: data.amount,
          fee: data.fees,
          date: new Date(data.timestamp).toLocaleDateString(),
          type: data.type,
          status: data.status,
          wallet: data.walletId,
          account: data.accountId,
          asset: data.assetId,
          sender: data.inputs.map((s: ITransactionInputOutput) => ({
            address: s.address,
            tag: s.isMine,
          })),
          receiver: data.outputs.map((r: ITransactionInputOutput) => ({
            address: r.address,
            tag: r.isMine,
          })),
        };
        setTransaction(formattedTransaction);
      }
    }

    getTransactionData();
  }, []);

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(text);
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  if (!transaction) {
    return <NoDataScreen title="Loading Data!" />;
  }

  return (
    <ScreenContainer>
      <Flex
        direction="column"
        gap={4}
        style={{
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          width: '100%',
          flex: 1,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Typography type="para" textAlign="left">
          {strings.history.history.title}
        </Typography>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#2F2422',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            marginBottom: 16,
          }}
        >
          <Typography type="body" textAlign="left" style={{ flex: 1 }}>
            {id}
          </Typography>
          <Copy
            size={10}
            onPress={() => handleCopy(id as string)}
            copied={copied === id}
          />
        </View>
        <ScrollView style={{ width: '100%' }}>
          {Object.entries(transaction).map(([key, value], i) => (
            <Flex
              style={[
                {
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  width: '100%',
                  paddingVertical: 6,
                },
                i !== Object.entries(transaction).length - 1
                  ? {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border.secondary,
                    }
                  : {},
                key === 'sender' && { marginTop: 16 },
              ]}
              key={i}
              direction={
                key === 'sender' || key === 'receiver' ? 'column' : 'row'
              }
            >
              <Typography
                type="body"
                color="secondary"
                style={{ textTransform: 'capitalize' }}
              >
                {key}
              </Typography>
              {Array.isArray(value) ? (
                value.map((item: ISender, itemIndex: number) => (
                  <Flex
                    key={`${key}-${itemIndex}`}
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      paddingTop: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      type="body"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      textAlign="left"
                      color={item.tag ? 'secondary' : undefined}
                      style={{ flex: 1 }}
                    >
                      {item.address}
                    </Typography>
                    <Flex
                      style={{
                        marginLeft: 'auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {item.tag && <Tag>Mine</Tag>}
                      <Copy
                        size={10}
                        onPress={() => handleCopy(item.address)}
                        copied={copied === item.address}
                      />
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Typography type="body">{value}</Typography>
              )}
            </Flex>
          ))}
        </ScrollView>
      </Flex>
    </ScreenContainer>
  );
}
