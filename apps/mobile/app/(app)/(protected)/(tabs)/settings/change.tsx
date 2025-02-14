import React, { useState, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
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

export default function ChangePassword() {
  const { strings } = useAppSelector(selectLanguage);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handleContinue = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      setPasswordValid(true);
      return;
    }

    const success = false;

    if (success) {
      setPasswordChanged(true);
    }
  };

  if (passwordChanged) {
    return <Success title={strings.settings.newPasswordAdded.title} />;
  }

  return (
    <ScreenContainer
      style={{ paddingVertical: 12, paddingHorizontal: 16, paddingBottom: 24 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%', gap: 16 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Typography type="h3" textAlign="left">
          {strings.settings.changePassword.title}
        </Typography>
        <Container style={{ gap: 8 }}>
          <Input
            placeholder={
              strings.settings.changePassword.inputs.oldPassword.placeholder
            }
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />
          <Input
            placeholder={
              strings.settings.changePassword.inputs.newPassword.placeholder
            }
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Typography
            type="label"
            color={passwordValid ? 'secondary' : 'error'}
            textAlign="left"
          >
            {strings.settings.changePassword.inputs.description}
          </Typography>
          <Input
            placeholder={
              strings.settings.changePassword.inputs.confirmPassword.placeholder
            }
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {!passwordsMatch && (
            <Typography
              type="label"
              textAlign="left"
              color={passwordValid ? 'secondary' : 'error'}
            >
              {
                strings.settings.changePassword.inputs.confirmPassword
                  .description
              }
            </Typography>
          )}
        </Container>
        <Button title={strings.buttons.continue} onPress={handleContinue} />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
