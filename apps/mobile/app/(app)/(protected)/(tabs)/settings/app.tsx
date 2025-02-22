import {
  Card,
  ChangePasswordIcon,
  InteractiveItem,
  NewPasswordIcon,
  RemovePasswordIcon,
  ScreenContainer,
} from '@/components/ui';
import { useLockscreen } from '@/contexts/useLockscreenContext';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';

export default function AppSettings() {
  const lang = useAppSelector(selectLanguage);
  const { isPasswordSet } = useLockscreen();
  const strings = lang.strings.settings.password;
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
            <NewPasswordIcon
              width={14}
              height={12}
              style={{ marginRight: 8 }}
            />
          }
          disabled={isPasswordSet}
          text={strings.addNewPassword}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/add')}
        />
        <InteractiveItem
          leftIcon={
            <ChangePasswordIcon
              width={14}
              height={14}
              style={{ marginRight: 8 }}
            />
          }
          disabled={!isPasswordSet}
          text={strings.changePassword}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/change')}
        />
        <InteractiveItem
          disabled={!isPasswordSet}
          leftIcon={
            <RemovePasswordIcon
              width={14}
              height={12}
              style={{ marginRight: 8 }}
            />
          }
          text={strings.removePassword}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/remove')}
        />
      </Card>
    </ScreenContainer>
  );
}
