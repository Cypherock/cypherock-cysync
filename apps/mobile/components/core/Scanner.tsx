import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { ImageBackground } from 'expo-image';
import { Images } from '@/constants/images';
import { Icon, Typography } from '../ui/atoms';
import {
  CameraView,
  useCameraPermissions,
  FlashMode,
  ScanningResult,
} from 'expo-camera';
import { useAppSelector, selectLanguage } from '@/store';
import { Redirect } from 'expo-router';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../ui/themes/color.styled';

const width = Dimensions.get('window').width;

interface ScannerProps {
  onQrScanned: (result: ScanningResult) => void;
  progress?: SharedValue<number>;
}

export function Scanner({ onQrScanned, progress }: ScannerProps) {
  const { strings } = useAppSelector(selectLanguage);
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [showProgress, setShowProgress] = useState(false);
  const [permission] = useCameraPermissions();

  useAnimatedReaction(
    () => progress?.value ?? 0,
    currentValue => {
      runOnJS(setShowProgress)(currentValue > 0);
    },
    [progress],
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      width: `${progress ? progress.value * 100 : 0}%`,
    }),
    [progress],
  );

  if (permission && !permission.granted) {
    return <Redirect href={'/permission'} />;
  }

  function toggleFlashMode() {
    setFlashMode(prev => (prev === 'on' ? 'off' : 'on'));
  }

  return (
    <View style={styles.container}>
      <Icon
        source={{
          default: Images.icon.thunder_default,
          disabled: Images.icon.thunder_disabed,
        }}
        size="big"
        state={flashMode === 'on' ? 'default' : 'disabled'}
        onPress={toggleFlashMode}
      />
      <ImageBackground
        source={Images.onboarding.qr_frame}
        style={styles.scanner}
      >
        <CameraView
          style={styles.camera}
          flash={flashMode}
          enableTorch={flashMode === 'on'}
          onBarcodeScanned={onQrScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
      </ImageBackground>
      <Typography type="body">
        {showProgress ? strings.scan.pleaseWait : strings.scan.alignQrCode}
      </Typography>
      {showProgress && (
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, animatedStyle]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: 'center',
  },
  scanner: {
    width: width,
    height: width,
    maxWidth: 300,
    maxHeight: 300,
    padding: 5,
  },
  camera: {
    flex: 1,
    backgroundColor: '#2C2825',
    borderRadius: 2,
  },
  progressBarContainer: {
    flex: 1,
    width: width,
    maxWidth: 250,
    maxHeight: 8,
    backgroundColor: colors.border.secondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    width: 0,
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
});
