import React from 'react';
import { OnboardingItem, ScreenContainer, useTheme } from '@/components/ui';
import { router } from 'expo-router';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import Feather from '@expo/vector-icons/Feather';
import { getDB } from '@/utils';
import { keyDb } from '@/db';
import { useLockscreen } from '@/contexts/useLockscreenContext';

export default function Reset() {
  const { strings } = useAppSelector(selectLanguage);
  const { removePassword } = useLockscreen();
  const theme = useTheme();
  const db = getDB();

  const reset = async () => {
    console.log('Reset Cysync');
    await db.clear();
    await keyDb.clear();
    await removePassword();
    router.dismissAll();
  };

  return (
    <ScreenContainer>
      <OnboardingItem
        id={1}
        imageNode={
          <Feather
            name="alert-triangle"
            size={100}
            color={theme.palette.error}
          />
        }
        title={strings.lockscreen.reset.title}
        titleType="h2"
        subtitle={strings.lockscreen.reset.description}
        actions={{
          primary: {
            title: strings.buttons.reset,
            onPress: reset,
          },
          secondary: {
            title: strings.buttons.cancel,
            onPress: () => router.back(),
          },
        }}
      />
    </ScreenContainer>
  );
}
