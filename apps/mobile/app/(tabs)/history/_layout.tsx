import { Header } from '@/components/core';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Stack } from 'expo-router';

export default function Layout() {
  const { strings } = useAppSelector(selectLanguage);
  return (
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
              showBack={true}
              onBackPress={() => navigation.canGoBack() && navigation.goBack()}
              title={options.title ?? route.name}
            />
          ),
        }}
      />
    </Stack>
  );
}
