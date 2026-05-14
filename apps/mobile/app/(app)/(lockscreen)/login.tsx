import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  LockedIcon,
  Input,
  LogotypeIcon,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useLockscreen } from '@/contexts/useLockscreenContext';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { strings } = useAppSelector(selectLanguage);
  const { unlock, isLocked } = useLockscreen();

  const handleUnlock = async () => {
    const success = await unlock(password);
    if (success) {
      setError('');
    } else {
      setError(strings.lockscreen.login.input.error);
    }
  };

  useEffect(() => {
    if (!isLocked) {
      router.dismissTo('/receive/wallet');
    }
  }, [isLocked]);

  return (
    <ScreenContainer type="all">
      <KeyboardAvoidingView
        style={{
          flex: 1,
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 24,
              gap: 16,
              width: '100%',
              flex: 1,
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: 21,
              }}
            >
              <LockedIcon />
              <LogotypeIcon />
            </View>
            <Typography type="body" color="secondary">
              {strings.lockscreen.login.tagline}
            </Typography>
            <Input
              label={strings.lockscreen.login.input.label}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#AAA"
              actionText={strings.lockscreen.login.input.action}
              onAction={() => router.push('/(app)/(lockscreen)/reset')}
              error={error}
              containerStyle={{ paddingVertical: 32 }}
            />
          </View>
          <Button
            title={strings.buttons.continue}
            onPress={handleUnlock}
            style={{ marginVertical: 12, width: '100%' }}
          />
        </Container>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
