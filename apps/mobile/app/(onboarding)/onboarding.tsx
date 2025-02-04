import { FlatList } from 'react-native';
import {
  IOnboardingItem,
  OnboardingItem,
  PagerDots,
  ScreenContainer,
} from '@/components/ui';
import { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Images } from '@/constants/images';
import { router } from 'expo-router';
import { Dimensions, StyleSheet, View } from 'react-native';

export default function Onboarding() {
  const { strings } = useAppSelector(selectLanguage);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pages: IOnboardingItem[] = [
    {
      id: 1,
      image: Images.onboarding.screen1,
      title: strings.onboarding.portfolio.title,
      subtitle: strings.onboarding.portfolio.description,
    },
    {
      id: 2,
      image: Images.onboarding.screen2,
      title: strings.onboarding.history.title,
      subtitle: strings.onboarding.history.description,
    },
    {
      id: 3,
      image: Images.onboarding.screen3,
      title: strings.onboarding.receive.title,
      subtitle: strings.onboarding.receive.description,
    },
    {
      id: 4,
      image: Images.onboarding.screen4,
      title: strings.onboarding.notifications.title,
      titleType: 'h2',
      subtitle: strings.onboarding.notifications.subtitle,
    },
    {
      id: 5, // New onboarding screen
      image: Images.onboarding.screen5, // The new image
      title: strings.onboarding.allSet.title,
      titleType: 'h2',
      subtitle: strings.onboarding.allSet.subtitle,
      actions: {
        primary: {
          title: strings.buttons.continue, // Or a specific title for this button
          onPress: () => router.push('/(onboarding)/PasswordPage'), 
        },
      },
    },
  ];

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index);
  };

  return (
    <ScreenContainer>
      <PagerDots index={currentIndex} length={pages.length} />
      <GestureHandlerRootView style={{flex: 1}}>
        <FlatList
          horizontal
          data={pages}
          extraData={pages}
          renderItem={({ item }) => <OnboardingItem {...item} />}
          keyExtractor={item => `${item.id}`}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          keyboardShouldPersistTaps="handled"
        />
      </GestureHandlerRootView>
    </ScreenContainer>
  );
}
