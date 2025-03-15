import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { Header } from '@/components/core';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/components/ui/themes/color.styled';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { HistoryIcon, ReceiveIcon } from '@/components/ui/icons';
import React from 'react';
import { BackgroundTasks } from '@/bgTasks';
import { HistoryProvider } from '@/contexts/useHistoryContext';

export default function Layout() {
  const { strings } = useAppSelector(selectLanguage);
  return (
    <>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <HistoryProvider>
            <Tabs
              screenOptions={{
                header: ({ navigation, route, options }) => (
                  <Header
                    onBackPress={() =>
                      navigation.canGoBack() && navigation.goBack()
                    }
                    title={route.name}
                    showBack={false}
                    {...options}
                  />
                ),
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#FEDD8F',
                sceneStyle: { backgroundColor: colors.background.primary },
              }}
            >
              <Tabs.Screen
                name="portfolio"
                options={{
                  title: strings.portfolio.heading,
                  tabBarLabel: strings.bottomTabs.portfolio,
                  headerShown: false,
                  tabBarIcon: props => (
                    <MaterialCommunityIcons
                      name="chart-box-outline"
                      size={20}
                      color={props.color}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="history"
                options={{
                  title: strings.history.heading,
                  tabBarLabel: strings.bottomTabs.history,
                  tabBarIcon: props => (
                    <HistoryIcon size={20} color={props.color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="receive"
                options={{
                  title: strings.receive.heading,
                  tabBarLabel: strings.bottomTabs.receive,
                  headerShown: false,
                  tabBarIcon: props => (
                    <ReceiveIcon size={20} color={props.color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="support"
                options={{
                  title: strings.support.heading,
                  tabBarLabel: strings.bottomTabs.support,
                  tabBarIcon: props => (
                    <Feather name="life-buoy" size={20} color={props.color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="settings"
                options={{
                  title: strings.settings.heading,
                  tabBarLabel: strings.bottomTabs.settings,
                  headerShown: false,
                  tabBarIcon: props => (
                    <Ionicons
                      name="settings-outline"
                      size={20}
                      color={props.color}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="notification"
                options={{
                  title: strings.notifications.heading,
                  href: null,
                }}
              />
              <Tabs.Screen
                name="details"
                options={{
                  title: 'Transaction',
                  href: null,
                  header: ({ options, route }) => (
                    <Header
                      showBack={false}
                      title={options.title ?? route.name}
                      leftIcon={options.headerLeft && options.headerLeft({})}
                      {...options}
                    />
                  ),
                }}
              />
            </Tabs>
          </HistoryProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      <BackgroundTasks />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: '#39322C',
    backgroundColor: '#1C1815',
  },
});
