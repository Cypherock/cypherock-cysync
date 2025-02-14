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
            onBackPress={() => navigation.canGoBack() && navigation.goBack()}
            title={options.title ?? route.name}
            showBack={true}
          />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: strings.portfolio.heading,
          header: ({ navigation, options, route }) => (
            <Header
              onBackPress={() => navigation.canGoBack() && navigation.goBack()}
              title={options.title ?? route.name}
              showBack={false}
            />
          ),
        }}
      />
      <Stack.Screen name="coins/[id]" />
      <Stack.Screen name="accounts/[id]" />
    </Stack>
  );
}
