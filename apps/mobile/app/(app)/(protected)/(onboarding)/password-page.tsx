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
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);

  const handleContinue = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      setPasswordValid(true);
      return;
    }
    setPasswordsMatch(true);
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

  const validationStrings = strings.onboarding.passwordPage.validation;
  const hasMinLength = newPassword.length >= 8;
  const hasDigit = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);
  let validationMessage = null;
  if (confirmPasswordFocused) {
    if (!hasMinLength) {
      validationMessage = validationStrings.minLength;
    } else if (!hasDigit) {
      validationMessage = validationStrings.minDigit;
    } else if (!hasUppercase) {
      validationMessage = validationStrings.minUppercase;
    } else if (!hasSpecialChar) {
      validationMessage = validationStrings.minSpecialChar;
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          width: '100%',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
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
              onFocus={() => setNewPasswordFocused(true)}
              onBlur={() => setNewPasswordFocused(false)}
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
              onFocus={() => setConfirmPasswordFocused(true)}
              onBlur={() => setConfirmPasswordFocused(false)}
            />
            {!passwordsMatch && (
              <Typography type="label" color="error" textAlign="left">
                {
                  strings.onboarding.passwordPage.inputs.confirmPassword
                    .description
                }
              </Typography>
            )}
            {confirmPasswordFocused && validationMessage && (
              <Typography type="label" color="error" textAlign="left">
                {validationMessage}
              </Typography>
            )}
          </Container>
        </Container>
      </KeyboardAvoidingView>
      <View
        style={{
          gap: 8,
          width: '100%',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        <Button title={strings.buttons.continue} onPress={handleContinue} />
        <Button
          title={strings.buttons.skip}
          onPress={handleSkip}
          type="secondary"
        />
      </View>
    </ScreenContainer>
  );
}
