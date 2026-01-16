import {
  Button,
  Card,
  Container,
  InteractiveItem,
  ScreenContainer,
  Seperator,
  Typography,
} from '@/components/ui';
import {
  useAppSelector,
  useAppDispatch,
  selectCurrency,
  setCurrency,
} from '@/store';
import { fetchSupportedCurrencies } from '@/store/currency';
import { selectLanguage } from '@/store/lang';
import { useEffect, useState } from 'react';
import { FlatList, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { IFiatCurrency } from '@cypherock/coins';

const getCurrencySymbol = (code: string): string => {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'symbol',
    });
    const parts = formatter.formatToParts(0);
    const symbol = parts.find(p => p.type === 'currency')?.value;
    return symbol || code;
  } catch {
    return code;
  }
};

export default function Currency() {
  const lang = useAppSelector(selectLanguage);
  const { currentCurrency, availableCurrencies, isLoading } =
    useAppSelector(selectCurrency);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [selected, setSelected] = useState<IFiatCurrency | undefined>(
    availableCurrencies.find(
      c => c.code.toLowerCase() === currentCurrency.toLowerCase(),
    ),
  );

  useEffect(() => {
    dispatch(fetchSupportedCurrencies() as any);
  }, [dispatch]);

  useEffect(() => {
    const curr = availableCurrencies.find(
      c => c.code.toLowerCase() === currentCurrency.toLowerCase(),
    );
    if (curr) setSelected(curr);
  }, [currentCurrency, availableCurrencies]);

  const strings = lang.strings.settings.preferredCurrency;

  const onApply = () => {
    if (selected) {
      dispatch(setCurrency(selected.code.toLowerCase()) as any);
      router.back();
    }
  };

  return (
    <ScreenContainer>
      <Container
        style={{
          gap: 24,
          justifyContent: 'flex-start',
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Typography type="h3" textAlign="left" color="primary">
          {strings.title}
        </Typography>
        <Card
          style={{
            paddingVertical: 0,
            paddingHorizontal: 0,
            flex: 1,
          }}
        >
          {isLoading ? (
            <Container style={{ padding: 20 }}>
              <ActivityIndicator size="large" />
            </Container>
          ) : (
            <FlatList
              style={{ width: '100%' }}
              data={availableCurrencies}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <InteractiveItem
                  leftIcon={
                    <Typography type="body" style={{ fontWeight: 'bold' }}>
                      {getCurrencySymbol(item.code)}
                    </Typography>
                  }
                  text={item.code}
                  altText={`(${item.name})`}
                  rightIcon={
                    <Text style={{ width: 18 }}>{item.countryFlag}</Text>
                  }
                  style={{ flex: 1, width: '100%' }}
                  selected={selected?.code === item.code}
                  onPress={() => setSelected(item)}
                />
              )}
              ItemSeparatorComponent={() => <Seperator />}
            />
          )}
        </Card>
      </Container>
      <Container style={{ justifyContent: 'flex-end', flex: 0 }}>
        <Button
          title="Apply"
          onPress={onApply}
          disabled={!selected}
          style={{ marginVertical: 12, marginHorizontal: 16 }}
        />
      </Container>
    </ScreenContainer>
  );
}
