import {
  Button,
  Container,
  Input,
  ScreenContainer,
  Success,
  Typography,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useState } from 'react';
import { View } from 'react-native';

export default function ChangePassword() {
  const lang = useAppSelector(selectLanguage);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const strings = lang.strings.settings;

  if (passwordChanged) {
    return <Success title={strings.newPasswordAdded.title} />;
  }

  return (
    <ScreenContainer>
      <Container
        style={{
          gap: 24,
          justifyContent: 'flex-start',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Typography type="h3" textAlign="left">
          {strings.changePassword.title}
        </Typography>
        <Container
          style={{
            paddingVertical: 0,
            paddingHorizontal: 0,
            gap: 16,
          }}
        >
          <View style={{ gap: 8 }}>
            <Input
              placeholder={
                strings.changePassword.inputs.oldPassword.placeholder
              }
            />
            <Input
              placeholder={
                strings.changePassword.inputs.newPassword.placeholder
              }
            />
            <Typography
              type="label"
              color="secondary"
              textAlign="left"
              style={{ flexShrink: 0 }}
            >
              {strings.changePassword.inputs.description}
            </Typography>
            <Input
              placeholder={
                strings.changePassword.inputs.confirmPassword.placeholder
              }
            />
            <Typography color="secondary" type="label" textAlign="left">
              {strings.changePassword.inputs.confirmPassword.description}
            </Typography>
          </View>
          <Container>
            <Typography color="secondary" type="body" textAlign="left">
              {strings.changePassword.inputs.radio.label}
            </Typography>
          </Container>
        </Container>
      </Container>
      <Container style={{ justifyContent: 'flex-end' }}>
        <Button
          title={lang.strings.buttons.continue}
          style={{ marginHorizontal: 16, marginVertical: 12 }}
          onPress={() => setPasswordChanged(true)}
        />
      </Container>
    </ScreenContainer>
  );
}
