import {
  Button,
  Container,
  ScreenContainer,
  Typography,
  Success,
} from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import { View } from 'react-native';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';

export default function RemovePassword() {
  const { strings } = useAppSelector(selectLanguage);
  const [passwordRemoved, setPasswordRemoved] = useState(false);

  if (passwordRemoved)
    return <Success title={strings.settings.passwordRemoved.title} />;

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
          onPress={() => setPasswordRemoved(true)}
        />
      </View>
    </ScreenContainer>
  );
}
