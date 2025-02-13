import React, { useState, useCallback } from 'react';
import { View, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
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
import styled from 'styled-components/native';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

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

const StyledKeyboardView = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const StyledContainer = styled(Container)`
  flex: 1;
  justify-content: space-between;
  padding-bottom: 16px;
  background-color: ${props => props.theme.palette.background.primary};
`;

const ContentContainer = styled(Container)`
  gap: 24px;
  padding: 16px;
`;

const InputContainer = styled(Container)`
  gap: 16px;
`;

const StyledInput = styled(Input)`
  background-color: ${props => props.theme.palette.background.input};
  color: ${props => props.theme.palette.text.primary};
  border-radius: 8px;
  padding-horizontal: 16px;
  padding-vertical: 12px;
`;

const ButtonContainer = styled(View)`
  padding-horizontal: 16px;
`;

const ContinueButton = styled(Button)`
  padding-vertical: 16px;
  border-radius: 8px;
  width: ${width - 32}px;
`;

export default function AddPassword() {
  const { strings } = useAppSelector(selectLanguage);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [success, setSuccess] = useState(false);

  const { save } = useSecurePasswordStorage();

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
    setSuccess(success);
  };

  if (success) {
    return <Success title={strings.settings.newPasswordAdded.title} />;
  }

  return (
    <ScreenContainer>
      <StyledKeyboardView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StyledContainer>
          <ContentContainer>
            <Typography type="h3" textAlign="left">
              {strings.settings.addNewPassword.title}
            </Typography>

            <InputContainer>
              <StyledInput
                placeholder={
                  strings.settings.addNewPassword.inputs.newPassword.placeholder
                }
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholderTextColor="#AAA"
              />
              <Typography
                type="label"
                color={passwordValid ? 'secondary' : 'error'}
                textAlign="left"
              >
                {strings.settings.addNewPassword.inputs.newPassword.description}
              </Typography>

              <StyledInput
                placeholder={
                  strings.settings.addNewPassword.inputs.confirmPassword
                    .placeholder
                }
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#AAA"
              />
              {!passwordsMatch && (
                <Typography color="error" type="label" textAlign="left">
                  {
                    strings.settings.addNewPassword.inputs.confirmPassword
                      .description
                  }
                </Typography>
              )}
            </InputContainer>
          </ContentContainer>

          <ButtonContainer>
            <ContinueButton title="Continue" onPress={handleContinue} />
          </ButtonContainer>
        </StyledContainer>
      </StyledKeyboardView>
    </ScreenContainer>
  );
}
