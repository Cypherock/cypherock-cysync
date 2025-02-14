import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
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
import { useLockscreen } from '@/contexts/useLockscreenContext';

const validatePassword = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/;
  return regex.test(password);
};

export default function AddPassword() {
  const { strings } = useAppSelector(selectLanguage);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [success, setSuccess] = useState(false);
  const { setPassword } = useLockscreen();

  const handleContinue = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      setPasswordValid(true);
      return;
    }

    const isValid = validatePassword(newPassword);
    setPasswordValid(isValid);
    if (!isValid) return;

    const success = await setPassword(newPassword);
    setSuccess(success);
  };

  if (success) {
    return <Success title={strings.settings.newPasswordAdded.title} />;
  }

  return (
    <ScreenContainer
      style={{ paddingVertical: 12, paddingHorizontal: 16, paddingBottom: 24 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      >
        <Container style={{ gap: 16 }}>
          <Typography type="h3" textAlign="left">
            {strings.onboarding.passwordPage.title}
          </Typography>
          <Container style={{ gap: 8 }}>
            <Input
              placeholder={
                strings.settings.addNewPassword.inputs.newPassword.placeholder
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
              {strings.settings.addNewPassword.inputs.newPassword.description}
            </Typography>
            <Input
              placeholder={
                strings.settings.addNewPassword.inputs.confirmPassword
                  .placeholder
              }
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            {!passwordsMatch && (
              <Typography type="label" color="error" textAlign="left">
                {
                  strings.settings.addNewPassword.inputs.confirmPassword
                    .description
                }
              </Typography>
            )}
          </Container>
        </Container>
        <Button title={strings.buttons.continue} onPress={handleContinue} />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
