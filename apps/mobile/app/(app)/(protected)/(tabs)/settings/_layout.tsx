import { Header } from '@/components/core';
import { useLockscreen } from '@/contexts/useLockscreenContext';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Stack } from 'expo-router';

export default function Layout() {
  const { strings } = useAppSelector(selectLanguage);
  const { isPasswordSet } = useLockscreen();
  return (
    <Stack
      screenOptions={{
        header: ({ navigation, options, route }) => (
          <Header
            onBackPress={() => navigation.canGoBack() && navigation.goBack()}
            title={options.title ?? route.name}
          />
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: strings.settings.heading,
          header: ({ navigation, route, options }) => (
            <Header
              onBackPress={() => navigation.canGoBack() && navigation.goBack()}
              title={options.title ?? route.name}
              showBack={false}
            />
          ),
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: strings.settings.displayLanguage.heading,
        }}
      />
      <Stack.Screen
        name="currency"
        options={{
          title: strings.settings.preferredCurrency.heading,
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: strings.settings.about.heading,
        }}
      />
      <Stack.Screen
        name="app"
        options={{ title: strings.settings.password.heading }}
      />
      <Stack.Screen
        name="add"
        redirect={isPasswordSet}
        options={{ title: strings.settings.password.heading }}
      />
      <Stack.Screen
        name="remove"
        redirect={!isPasswordSet}
        options={{ title: strings.settings.password.heading }}
      />
      <Stack.Screen
        name="change"
        redirect={!isPasswordSet}
        options={{ title: strings.settings.password.heading }}
      />
    </Stack>
  );
}
