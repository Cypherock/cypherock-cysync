import {
  AboutIcon,
  AppSettingsIcon,
  Card,
  GeneralSettingsIcon,
  InteractiveItem,
  ScreenContainer,
  Seperator,
} from '@/components/ui';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import React from 'react';

export default function Settings() {
  const { strings } = useAppSelector(selectLanguage);
  const settingsStrings = strings.settings.settings;

  return (
    <ScreenContainer>
      <Card
        style={{
          marginVertical: 12,
          marginHorizontal: 16,
          paddingVertical: 0,
          paddingHorizontal: 0,
        }}
      >
        <InteractiveItem
          leftIcon={
            <GeneralSettingsIcon
              width={14}
              height={14}
              style={{ marginRight: 8 }}
            />
          }
          text={settingsStrings.displayLanguage}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/language')}
        />
        <Seperator />
        <InteractiveItem
          leftIcon={
            <AppSettingsIcon
              width={14}
              height={14}
              style={{ marginRight: 8 }}
            />
          }
          text={settingsStrings.password}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/app')}
        />
        <Seperator />
        <InteractiveItem
          leftIcon={
            <AboutIcon width={14} height={14} style={{ marginRight: 8 }} />
          }
          text={settingsStrings.about}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/about')}
        />
      </Card>
    </ScreenContainer>
  );
}
