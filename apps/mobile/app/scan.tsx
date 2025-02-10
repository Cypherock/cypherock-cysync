import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Icon, MessageBox, ScreenContainer, Typography } from '@/components/ui';
import { Scanner } from '@/components/core';
import IonIcon from '@expo/vector-icons/Ionicons';
import { Images } from '@/constants/images';
import { router } from 'expo-router';
import { ScanningResult } from 'expo-camera';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { getDB } from '@/utils';
import { inflate } from 'pako';
import { Animated } from 'react-native';
import { colors } from '@/components/ui/themes/color.styled';

interface CysyncData {
  wallets: IWallet[];
  accounts: IAccount[];
}

export default function Scan() {
  const { strings } = useAppSelector(selectLanguage);  
  const scannedData = useRef<Record<number, string>>({});
  const [decodedData, setDecodedData] = useState<CysyncData>();
  const [totalChunks, setTotalChunks] = useState(0);
  const [chunksReceived, setChunksReceived] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  function navigateToNext() {
    router.dismissTo('/info');
  }

  function onQrScanned(qr: ScanningResult) {
    const data = qr.data.split('|');
    const chunkIndex = Number(data[1]);
    const dataLength = Number(data[2]);
    const chunkData = data[3];

    if (scannedData.current[chunkIndex]) return;

    scannedData.current[chunkIndex] = chunkData;
    setTotalChunks(dataLength);
    setChunksReceived(Object.keys(scannedData.current).length);

    if (Object.keys(scannedData.current).length === dataLength) {
      const sortedChunks = Object.keys(scannedData.current)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => scannedData.current[Number(key)]);

      const completeData = sortedChunks.join('');
      const buffer = Buffer.from(completeData, 'base64');
      const decompressedData = inflate(new Uint8Array(buffer));
      const decodedData = Buffer.from(decompressedData).toString();
      setDecodedData(JSON.parse(decodedData) as CysyncData);
    }
  }

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: chunksReceived / (totalChunks || 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [chunksReceived, totalChunks, progressAnim]);

  async function saveDataToDb(data: CysyncData) {
    try {
      const db = getDB();
      await db.wallet.insert(data.wallets);
      await db.account.insert(data.accounts);
    } catch (error) {
      console.error('Error saving data to DB:', error);
      // TODO: Error message if the scan dosent happen (screen dosent exist in figma currently)
    }
  }

  useEffect(() => {
    if (decodedData) {
      saveDataToDb(decodedData);
      navigateToNext();
    }

    return () => {
      setDecodedData(undefined);
      scannedData.current = {};
      setChunksReceived(0);
      setTotalChunks(0);
    };
  }, [decodedData]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <ScreenContainer>
      <View style={styles.top}>
        <Icon
          source={{
            default: Images.icon.close_default,
            disabled: Images.icon.close_disabed,
          }}
          onPress={navigateToNext}
          size="small"
        />
      </View>
      <Scanner onQrScanned={onQrScanned} />
      <View style={styles.textContainer}>
        <Typography type="body" style={styles.pleaseWait}>
          {strings.scan.pleaseWait}  
        </Typography>

        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </View>

        <MessageBox
          type="warning"
          icon={
            <IonIcon
              name="person-circle-outline"
              color={colors.warning}
              size={24}
            />
          }
          text={strings.scan.messageBox.warning}  
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  top: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textContainer: {
    gap: 16,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  pleaseWait: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border.secondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
});