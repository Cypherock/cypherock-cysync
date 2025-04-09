import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  CypherockLockedIcon,
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
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexGrow: 5,
          width: '100%',
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 24,
              gap: 16,
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: 21,
              }}
            >
              <CypherockLockedIcon />
              <LogotypeIcon />
            </View>
            <Typography type="body" color="secondary">
              {strings.lockscreen.login.tagline}
            </Typography>
          </View>
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
        </Container>
      </KeyboardAvoidingView>
      <Container style={{ justifyContent: 'flex-end' }}>
        <Button
          title="Continue"
          onPress={handleUnlock}
          style={{ marginHorizontal: 16, marginVertical: 12 }}
        />
      </Container>
    </ScreenContainer>
  );
}
