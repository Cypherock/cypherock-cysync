import {
  Button,
  Container,
  ScreenContainer,
  Typography,
  Success,
} from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import AntDesign from '@expo/vector-icons/AntDesign';
import { View } from 'react-native';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useLockscreen } from '@/contexts/useLockscreenContext';
import { router } from 'expo-router';

export default function RemovePassword() {
  const { strings } = useAppSelector(selectLanguage);
  const { removePassword, isPasswordSet } = useLockscreen();

  if (!isPasswordSet) {
    setTimeout(() => router.back(), 2000);
    return <Success title={strings.settings.passwordRemoved.title} />;
  }

  return (
    <ScreenContainer>
      <Container
        style={{
          gap: 16,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <AntDesign
          name="questioncircle"
          size={64}
          color={colors.text.secondary}
        />
        <View style={{ gap: 4 }}>
          <Typography type="h3">
            {strings.settings.removePassword.title}
          </Typography>
          <Typography type="body" color="secondary" style={{ flexShrink: 0 }}>
            {strings.settings.removePassword.description}
          </Typography>
        </View>
      </Container>
      <View style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button
          title={strings.buttons.confirm}
          style={{ marginHorizontal: 16, marginVertical: 12 }}
          onPress={removePassword}
        />
      </View>
    </ScreenContainer>
  );
}
