import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import {
  Copy,
  Flex,
  ScreenContainer,
  StatusToColorHex,
  Tag,
  TransactionType,
  TransactionTypeToIcon,
  Typography,
} from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import * as Clipboard from 'expo-clipboard';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import { useHistoryContext } from '@/contexts/useHistoryContext';
import { selectLanguage, useAppSelector } from '@/store';
import { typedEntries } from '@/utils';
import { TransactionRowData } from '@/hooks';

export default function Index() {
  const { strings } = useAppSelector(selectLanguage);
  const { transaction, details } = useHistoryContext();
  const navigation = useNavigation();
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!transaction) return;
    navigation.setOptions({
      title: transaction.type === 'send' ? 'Sent' : 'Received',
      headerLeft: () =>
        TransactionTypeToIcon[transaction.type as TransactionType](
          transaction.status,
        ),
    });
  }, [transaction]);

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(text);
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  if (!details) {
    return <NoDataScreen title="Loading Data!" />;
  }

  function renderValue(
    key: string,
    transaction: TransactionRowData | undefined,
    value: string,
  ): React.ReactNode {
    return key === 'account' || key === 'asset' ? (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {key === 'account' && transaction?.accountIcon({ size: 16 })}
        {key === 'asset' && transaction?.assetIcon({ size: 16 })}
        <Typography type="body" textAlign="right">
          {value}
        </Typography>
      </View>
    ) : (
      <Typography
        type="body"
        style={[
          key === 'status' && transaction?.status
            ? {
                textTransform: 'uppercase',
                color: StatusToColorHex[transaction.status],
              }
            : {},
        ]}
        textAlign="right"
      >
        {value}
      </Typography>
    );
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
          {strings.history.details.title}
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
            {details.hash}
          </Typography>
          <Copy
            size={10}
            onPress={() => handleCopy(details.hash as string)}
            copied={copied === details.hash}
          />
        </View>
        <ScrollView style={{ width: '100%' }}>
          {typedEntries(details)
            .slice(1)
            .map(([key, value], i) => (
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
                  style={{ textTransform: 'capitalize', flexShrink: 0 }}
                >
                  {key}
                </Typography>
                {Array.isArray(value)
                  ? value.map((item, itemIndex: number) => (
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
                  : renderValue(key, transaction, value)}
              </Flex>
            ))}
        </ScrollView>
      </Flex>
    </ScreenContainer>
  );
}
