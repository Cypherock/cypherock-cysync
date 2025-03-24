import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { MessageBox, ScreenContainer } from '@/components/ui';
import { Scanner } from '@/components/core';
import IonIcon from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ScanningResult } from 'expo-camera';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { getDB } from '@/utils';
import { inflate } from 'pako';
import { colors } from '@/components/ui/themes/color.styled';
import Feather from '@expo/vector-icons/Feather';

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
  const progress = useSharedValue(0);

  function navigateToNext() {
    router.dismissTo('/loading');
  }

  function handleDismiss() {
    router.canDismiss() ? router.dismiss() : router.dismissTo('/info');
  }

  function onQrScanned(qr: ScanningResult) {
    const data = qr.data.split('|');
    if (data[0] !== 'CHUNK' && data.length !== 4) return;
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
    progress.value = withSpring(chunksReceived / (totalChunks || 1), {
      damping: 20,
      stiffness: 90,
    });
  }, [chunksReceived, totalChunks]);

  async function saveDataToDb(data: CysyncData) {
    try {
      const db = getDB();
      await db.wallet.insert(data.wallets);
      await db.account.insert(data.accounts);
    } catch (error) {
      console.error('Error saving data to DB:', error);
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

  return (
    <ScreenContainer>
      <View style={styles.top}>
        <Feather
          name="x"
          size={18}
          style={{ padding: 12 }}
          color={colors.text.primary}
          onPress={handleDismiss}
        />
      </View>
      <Scanner onQrScanned={onQrScanned} progress={progress} />
      <View style={styles.textContainer}>
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
    paddingVertical: 12,
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
});
