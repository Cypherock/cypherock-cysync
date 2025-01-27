import React, { useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  Button,
  Container,
  Flex,
  Input,
  Success,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import styled, { NativeTarget, useTheme } from 'styled-components/native';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';

const { height, width } = Dimensions.get('window');

const validatePassword = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,16})/;
  return regex.test(password);
};

const useSecurePasswordStorage = () => {
  const save = useCallback(async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log('Password stored securely');
      return true;
    } catch (error) {
      console.error('Failed to save password:', error);
      return false;
    }
  }, []);

  return { save };
};

export default function PasswordPage() {
  const router = useRouter();
  const { strings } = useAppSelector(selectLanguage);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const { save } = useSecurePasswordStorage();

  const theme = useTheme();

  const handleContinue = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      setPasswordValid(true);
      return;
    }
    const isValid = validatePassword(newPassword);
    setPasswordValid(isValid);
    if (!isValid) return;

    const success = await save('userPassword', newPassword);
    if (success) {
      setShowSuccess(true);
    }
  };

  if (showSuccess) {
    return (
      <ScreenContainer>
        <Success
          title={strings.onboarding.passwordPage.success.title}
          subTitle={strings.onboarding.passwordPage.success.subTitle}
          redirectRoute="/(onboarding)/info"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container
          style={{
            flex: 1,
            width,
            height,
            padding: 16,
          }}
        >
          <Flex direction="column" style={{ flex: 1, paddingTop: 24 }}>
            <Typography type="h3" style={styles.title}>
              {strings.onboarding.passwordPage.title}
            </Typography>

            <Container
              style={{ gap: 16, paddingVertical: 0, paddingHorizontal: 0 }}
            >
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
                style={styles.description}
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
                <Typography
                  type="label"
                  color="error"
                  style={styles.errorDescription}
                >
                  {
                    strings.onboarding.passwordPage.inputs.confirmPassword
                      .description
                  }
                </Typography>
              )}
            </Container>
          </Flex>

          <Container style={styles.buttonContainer}>
            <Button
              title={strings.buttons.continue}
              onPress={handleContinue}
              style={styles.button}
            />
          </Container>
        </Container>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 24,
  },
  description: {
    marginBottom: 16,
  },
  errorDescription: {
    marginTop: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
  },
});
