import {
  Button,
  Card,
  Container,
  InteractiveItem,
  ScreenContainer,
  Seperator,
  Typography,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useState } from 'react';
import { FlatList, Text } from 'react-native';

interface ICurrencyData {
  sign: string;
  title: string;
  altTitle: string;
  flag: string;
}

const DummyCurrencyData: ICurrencyData[] = [
  {
    sign: '$',
    title: 'USD',
    altTitle: '(United States Dollar)',
    flag: '🇺🇸',
  },
  {
    sign: '€',
    title: 'EUR',
    altTitle: '(Euro)',
    flag: '🇪🇺',
  },
  {
    sign: '₹',
    title: 'INR',
    altTitle: '(Indian Rupee)',
    flag: '🇮🇳',
  },
  {
    sign: '£',
    title: 'GBP',
    altTitle: '(British Pound)',
    flag: '🇬🇧',
  },
];

export default function Currency() {
  const lang = useAppSelector(selectLanguage);
  const [selected, setSelected] = useState<ICurrencyData | undefined>(
    undefined,
  );

  const strings = lang.strings.settings.preferredCurrency;

  return (
    <ScreenContainer>
      <Container
        style={{
          gap: 24,
          justifyContent: 'flex-start',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Typography type="h3" textAlign="left">
          {strings.title}
        </Typography>
        <Card
          style={{
            paddingVertical: 0,
            paddingHorizontal: 0,
          }}
        >
          <FlatList
            style={{ width: '100%' }}
            data={DummyCurrencyData}
            renderItem={({ item }) => (
              <InteractiveItem
                leftIcon={
                  <Typography type="body" style={{ fontWeight: 'bold' }}>
                    {item.sign}
                  </Typography>
                }
                text={item.title}
                altText={item.altTitle}
                rightIcon={<Text style={{ width: 18 }}>{item.flag}</Text>}
                style={{ flex: 1, width: '100%' }}
                selected={selected?.title === item.title}
                onPress={() => setSelected(item)}
              />
            )}
            ItemSeparatorComponent={() => <Seperator />}
          />
        </Card>
      </Container>
      <Container style={{ justifyContent: 'flex-end' }}>
        <Button
          title="Apply"
          style={{ width: '100%', marginVertical: 12, marginHorizontal: 16 }}
        />
      </Container>
    </ScreenContainer>
  );
}
