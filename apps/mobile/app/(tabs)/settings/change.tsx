import React, { useState, useCallback } from 'react';
import { View, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Button,
  Container,
  Input,
  ScreenContainer,
  Success,
  Typography,
  // Removed RadioButton import
  // RadioButton,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import * as SecureStore from 'expo-secure-store';
import styled from 'styled-components/native';

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

const KeyboardView = styled(KeyboardAvoidingView)`
  flex: 1;
  width: ${width}px;
`;

const MainContainer = styled(View)`
  flex: 1;
  width: ${width}px;
  height: ${height}px;
  padding: 16px;
  background-color: ${props => props.theme.palette.background.primary};
  justify-content: space-between;
`;

const ContentContainer = styled(View)`
  flex: 1;
  padding-top: 24px;
`;

const Heading = styled(Typography)`
  color: ${props => props.theme.palette.text.primary};
  font-size: ${props => props.theme.typography.heading.h3.fontSize}px;
  font-weight: ${props => props.theme.typography.heading.shared.fontWeight};
  margin-bottom: 24px;
`;

const InputContainer = styled(Container)`
  padding-vertical: 0;
  padding-horizontal: 0;
  gap: 16px;
`;

const StyledInput = styled(Input)`
  background-color: ${props => props.theme.palette.background.input};
  color: ${props => props.theme.palette.text.primary};
  border-radius: 8px;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  margin-bottom: 8px;
`;

const HelperText = styled(Typography)`
  color: ${props => props.theme.palette.text.secondary};
  font-size: ${props => props.theme.typography.body.label.fontSize}px;
  margin-bottom: 16px;
`;

const ErrorText = styled(Typography)`
  color: ${props => props.theme.palette.text.error};
  font-size: ${props => props.theme.typography.body.label.fontSize}px;
  margin-top: -8px;
  margin-bottom: 16px;
`;

// Removed RadioButtonContainer styled component
/*
const RadioButtonContainer = styled(View)`
  margin-top: 8px;
`;
*/

const ButtonContainer = styled(View)`
  width: 100%;
  gap: 12px;
  margin-top: auto;
  padding-bottom: 16px;
`;

const StyledButton = styled(Button)`
  border-radius: 8px;
  padding-vertical: 16px;
`;

const ContinueButton = styled(StyledButton)`
  background-color: ${props => props.theme.palette.accent};
`;

export default function ChangePassword() {
  const { strings } = useAppSelector(selectLanguage);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  // Removed allowFingerprint state
  /*
  const [allowFingerprint, setAllowFingerprint] = useState(false);
  */
  const [passwordChanged, setPasswordChanged] = useState(false);

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
    if (success) {
      setPasswordChanged(true);
    }
  };

  if (passwordChanged) {
    return <Success title={strings.settings.newPasswordAdded.title} />;
  }

  return (
    <ScreenContainer>
      <KeyboardView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <MainContainer>
          <ContentContainer>
            <Heading type="h3" textAlign="left">
              {strings.settings.changePassword.title}
            </Heading>
            <InputContainer>
              <StyledInput
                placeholder={
                  strings.settings.changePassword.inputs.oldPassword.placeholder
                }
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
              />
              <StyledInput
                placeholder={
                  strings.settings.changePassword.inputs.newPassword.placeholder
                }
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <HelperText
                type="label"
                color={passwordValid ? 'secondary' : 'error'}
                textAlign="left"
              >
                {strings.settings.changePassword.inputs.description}
              </HelperText>
              <StyledInput
                placeholder={
                  strings.settings.changePassword.inputs.confirmPassword
                    .placeholder
                }
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {!passwordsMatch && (
                <ErrorText type="label" textAlign="left">
                  {
                    strings.settings.changePassword.inputs.confirmPassword
                      .description
                  }
                </ErrorText>
              )}
              {/* Removed RadioButtonContainer and RadioButton */}
              {/*
              <RadioButtonContainer>
                <RadioButton
                  selected={allowFingerprint}
                  onPress={() => setAllowFingerprint(!allowFingerprint)}
                  label={strings.settings.changePassword.inputs.radio.label}
                />
              </RadioButtonContainer>
              */}
            </InputContainer>
          </ContentContainer>
          <ButtonContainer>
            <ContinueButton
              title={strings.buttons.continue}
              onPress={handleContinue}
            />
          </ButtonContainer>
        </MainContainer>
      </KeyboardView>
    </ScreenContainer>
  );
}
