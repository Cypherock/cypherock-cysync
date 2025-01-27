import { View, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Copy, Flex, ScreenContainer, Tag, Typography } from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';

interface ISender {
  address: string;
  tag?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IReceiver extends ISender {}

interface ITransaction {
  value: string;
  fee: string;
  date: string;
  type: string;
  status: string;
  wallet: string;
  account: string;
  asset: string;
  sender: ISender[];
  receiver: IReceiver[];
}

const Transaction: ITransaction = {
  value: '100.00',
  fee: '0.50',
  date: '2024-12-30T10:30:00Z',
  type: 'send',
  status: 'completed',
  wallet: 'wallet_001',
  account: 'account_12345',
  asset: 'BTC',
  sender: [
    {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      tag: 'mine',
    },
  ],
  receiver: [
    {
      address: '1Fgk5H6a9qTk9HWt7h8gP9YwZdpCVR75GH',
    },
    {
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      tag: 'mine',
    },
  ],
};

export default function Index() {
  const { strings } = useAppSelector(selectLanguage);
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title:
        Transaction.type === 'send'
          ? strings.history.details.heading.sent
          : strings.history.details.heading.received,
    });
  }, []);

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
          <Copy size={10} />
        </View>
        <ScrollView>
          {Object.entries(Transaction).map(([key, value], i) => (
            <Flex
              style={[
                {
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  width: '100%',
                  paddingVertical: 6,
                },
                i !== Object.entries(Transaction).length - 1
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
                value.map((item: ISender) => (
                  <Flex
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      paddingTop: 8,
                      gap: 8,
                    }}
                  >
                    <Typography
                      type="body"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      textAlign="left"
                      color={item.tag ? 'secondary' : undefined}
                    >
                      {item.address}
                    </Typography>
                    {item.tag && <Tag>{item.tag}</Tag>}
                    <Copy size={10} style={{ marginLeft: 'auto' }} />
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
