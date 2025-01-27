import { Dimensions, StyleSheet, View } from 'react-native';
import React, { ReactNode } from 'react';
import { Typography, Button } from '../atoms';
import { Image } from 'expo-image';

const width = Dimensions.get('window').width;

export interface IOnboardingItem {
  id: number;
  image?: any;
  imageNode?: ReactNode;
  title: string;
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
  return (
    <View style={[styles.container]}>
      <View style={styles.imageContainer}>
        {props.image && (
          <Image source={props.image} style={{ width: 172, height: 172 }} />
        )}
        {props.imageNode && props.imageNode}
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Typography type={'display'}>{props.title}</Typography>
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
              onPress={() => props.actions?.primary.onPress()}
            />
            {props.actions.secondary && (
              <Button
                type="secondary"
                title={props.actions.secondary.title}
                onPress={() => props.actions?.secondary?.onPress()}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    width: width,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    gap: 24,
  },
  textContainer: {
    paddingHorizontal: 24,
    gap: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 156,
  },
  actionsContainer: {
    marginTop: 'auto',
    gap: 16,
    alignSelf: 'stretch',
    marginBottom: 34,
  },
});
