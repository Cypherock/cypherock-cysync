import {
  AboutIcon,
  AppSettingsIcon,
  Card,
  GeneralSettingsIcon,
  InteractiveItem,
  ScreenContainer,
} from '@/components/ui';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';

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
          leftIcon={<GeneralSettingsIcon />}
          text={settingsStrings.general}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/general')}
        />
        <InteractiveItem
          leftIcon={<AppSettingsIcon />}
          text={settingsStrings.app}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/app')}
        />
        <InteractiveItem
          leftIcon={<AboutIcon />}
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
