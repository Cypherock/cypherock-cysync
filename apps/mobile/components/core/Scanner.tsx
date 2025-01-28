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
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Redirect } from 'expo-router';

const width = Dimensions.get('window').width;

interface ScannerProps {
  onQrScanned: (result: ScanningResult) => void;
}

export function Scanner({ onQrScanned }: ScannerProps) {
  const { strings } = useAppSelector(selectLanguage);
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [permission] = useCameraPermissions();

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
          onBarcodeScanned={onQrScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />
      </ImageBackground>
      <Typography type="body">{strings.scan.alignQrCode}</Typography>
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
});
