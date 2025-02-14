import { Header } from '@/components/core';
import { ReceiveProvider } from '@/contexts/useReceiveContext';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Stack } from 'expo-router';

export default function Layout() {
  const { strings } = useAppSelector(selectLanguage);
  return (
    <ReceiveProvider>
      <Stack
        screenOptions={{
          header: ({ navigation, options, route }) => (
            <Header
              onBackPress={() => navigation.canGoBack() && navigation.goBack()}
              title={options.title ?? route.name}
            />
          ),
          headerTitle: strings.receive.heading,
        }}
      >
        <Stack.Screen
          name="wallet"
          options={{
            title: strings.receive.heading,
            header: ({ navigation, route, options }) => (
              <Header
                onBackPress={() =>
                  navigation.canGoBack() && navigation.goBack()
                }
                title={options.title ?? route.name}
                showBack={false}
              />
            ),
          }}
        />
        <Stack.Screen
          name="account"
          options={{ title: strings.receive.heading }}
        />
        <Stack.Screen
          name="address"
          options={{ title: strings.receive.heading }}
        />
      </Stack>
    </ReceiveProvider>
  );
}
