import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
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

export default function ChangePassword() {
  const { strings } = useAppSelector(selectLanguage);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true); // Tracks overall validity
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false); 
  const { setPassword: changeAppPassword } = useLockscreen();

  const handleContinue = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      setPasswordValid(true); // Keep overall validity true; show mismatch only
      return;
    }

    setPasswordsMatch(true); // Reset mismatch

    const isValid = validatePassword(newPassword);
    setPasswordValid(isValid);
    if (!isValid) return;

    const success = await changeAppPassword(newPassword, oldPassword);
    if (success) {
      setPasswordChanged(true);
    }
  };

  if (passwordChanged) {
    return <Success title={strings.settings.newPasswordAdded.title} />;
  }

  const validationStrings = strings.onboarding.passwordPage.validation;
  const hasMinLength = newPassword.length >= 8;
  const hasDigit = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);

  // Determine which validation message to show, if any.
  let validationMessage = null;
  if (confirmPasswordFocused) {
    // Only show after confirm password focus
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
            onFocus={() => setNewPasswordFocused(true)} // NEW
            onBlur={() => setNewPasswordFocused(false)} // NEW
          />
          <Typography // This is the restored guideline
            type="label"
            color={passwordValid ? 'secondary' : 'error'} // Keep color logic
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
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
          />
          {!passwordsMatch && (
            <Typography type="label" textAlign="left" color="error">
              {
                strings.settings.changePassword.inputs.confirmPassword
                  .description
              }
            </Typography>
          )}
          {/* Display only one validation message, and only when confirm password is focused */}
          {confirmPasswordFocused && validationMessage && (
            <Typography type="label" color="error" textAlign="left">
              {validationMessage}
            </Typography>
          )}
        </Container>
        <Button title={strings.buttons.continue} onPress={handleContinue} />
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
