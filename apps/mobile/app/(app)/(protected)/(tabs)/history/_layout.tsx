import { Header } from '@/components/core';
import { HistoryProvider } from '@/contexts/useHistoryContext';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Stack } from 'expo-router';

export default function Layout() {
  const { strings } = useAppSelector(selectLanguage);
  return (
    <HistoryProvider>
      <Stack
        screenOptions={{
          header: ({ navigation, options, route }) => (
            <Header
              showBack={false}
              onBackPress={() => navigation.canGoBack() && navigation.goBack()}
              title={options.title ?? route.name}
            />
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: strings.history.heading,
          }}
        />
        <Stack.Screen
          name="details/[id]"
          options={{
            title: 'Transaction',
            header: ({ navigation, options, route }) => (
              <Header
                showBack={false}
                onBackPress={() =>
                  navigation.canGoBack() && navigation.goBack()
                }
                title={options.title ?? route.name}
                leftIcon={options.headerLeft && options.headerLeft({})}
                {...options}
              />
            ),
          }}
        />
      </Stack>
    </HistoryProvider>
  );
}
