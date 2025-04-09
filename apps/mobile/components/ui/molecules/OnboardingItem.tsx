import { Dimensions, StyleSheet, View } from 'react-native';
import React, { ReactNode, useEffect, useState } from 'react';
import { Typography, Button, TypographyProps } from '../atoms';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export interface IOnboardingItem {
  id: number;
  image?: any;
  imageNode?: ReactNode;
  title: string;
  titleType?: TypographyProps['type'];
  subtitle?: string;
  subtitles?: string[];
  actions?: {
    primary: {
      title: string;
      onPress: () => void;
    };
    secondary?: {
      title: string;
      onPress: () => void;
    };
  };
}

export function OnboardingItem(props: IOnboardingItem) {
  const [screenWidth, setScreenWidth] = useState(width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <View style={styles.imageContainer}>
        {props.image && (
          <Image
            source={props.image}
            style={styles.image}
            contentFit="contain"
          />
        )}
        {props.imageNode && props.imageNode}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Typography type={props.titleType ?? 'display'}>
            {props.title}
          </Typography>
          {props.subtitle && (
            <Typography type="para">{props.subtitle}</Typography>
          )}
          {props.subtitles &&
            props.subtitles.map((subtitle: string, index: number) => (
              <Typography key={index} type="para">
                {subtitle}
              </Typography>
            ))}
        </View>
        {props.actions && (
          <View style={styles.actionsContainer}>
            <Button
              title={props.actions.primary.title}
              onPress={props.actions.primary.onPress}
            />
            {props.actions.secondary && (
              <Button
                type="secondary"
                title={props.actions.secondary.title}
                onPress={props.actions.secondary.onPress}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20%',
    marginBottom: 20,
    flex: 1,
  },
  image: {
    width: 172,
    height: 172,
  },
  bottomContainer: {
    gap: 24,
    width: '100%',
    marginBottom: '10%',
  },
  textContainer: {
    minHeight: 160,
    paddingHorizontal: 24,
    gap: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionsContainer: {
    gap: 16,
    alignSelf: 'stretch',
    marginBottom: 15,
    marginTop: 30,
  },
});
