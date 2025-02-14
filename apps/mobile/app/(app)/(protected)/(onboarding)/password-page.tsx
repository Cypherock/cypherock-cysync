import React, { useState, useCallback } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, View } from 'react-native';
import { router } from 'expo-router';
import {
  Button,
  Container,
  Input,
  Success,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { useTheme } from 'styled-components/native';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useLockscreen } from '@/contexts/useLockscreenContext';

const validatePassword = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/;
  return regex.test(password);
};

export default function PasswordPage() {
  const { strings } = useAppSelector(selectLanguage);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
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
    if (success) {
      setShowSuccess(true);
      setTimeout(() => {
        router.replace('/onboarding-scan');
      }, 2000);
    }
  };

  const handleSkip = () => {
    router.replace('/onboarding-scan');
  };

  if (showSuccess) {
    return (
      <ScreenContainer>
        <Success
          title={strings.onboarding.passwordPage.success.title}
          subTitle={strings.onboarding.passwordPage.success.subTitle}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      style={{ paddingVertical: 12, paddingHorizontal: 16, paddingBottom: 24 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container style={{ gap: 16 }}>
          <Typography type="h3" textAlign="left">
            {strings.onboarding.passwordPage.title}
          </Typography>
          <Container style={{ gap: 8 }}>
            <Input
              placeholder={
                strings.onboarding.passwordPage.inputs.newPassword.placeholder
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
              {strings.onboarding.passwordPage.inputs.newPassword.description}
            </Typography>
            <Input
              placeholder={
                strings.onboarding.passwordPage.inputs.confirmPassword
                  .placeholder
              }
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            {!passwordsMatch && (
              <Typography type="label" color="error" textAlign="left">
                {
                  strings.onboarding.passwordPage.inputs.confirmPassword
                    .description
                }
              </Typography>
            )}
          </Container>
        </Container>
        <View style={{ gap: 8, width: '100%' }}>
          <Button title={strings.buttons.continue} onPress={handleContinue} />
          <Button
            title={strings.buttons.skip}
            onPress={handleSkip}
            type="secondary"
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
