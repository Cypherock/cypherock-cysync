import {
  Card,
  InteractiveItem,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';

export default function General() {
  const { strings } = useAppSelector(selectLanguage);
  const settingsStrings = strings.settings.general;

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
            <Typography type="label" style={{ fontWeight: 'bold' }}>
              EN
            </Typography>
          }
          text={settingsStrings.displayLanguage}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/language')}
        />
        <InteractiveItem
          leftIcon={
            <Typography type="label" style={{ fontWeight: 'bold' }}>
              $
            </Typography>
          }
          text={settingsStrings.preferredCurrency}
          rightIcon={
            <Entypo name="chevron-small-right" size={16} color="white" />
          }
          onPress={() => router.push('/settings/currency')}
        />
      </Card>
    </ScreenContainer>
  );
}
