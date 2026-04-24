import { View, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { runOnJS, useSharedValue, withSpring } from 'react-native-reanimated';
import { MessageBox, ScreenContainer } from '@/components/ui';
import { Scanner } from '@/components/core';
import IonIcon from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { ScanningResult } from 'expo-camera';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { getDB } from '@/utils';
import { inflate } from 'pako';
import { colors } from '@/components/ui/themes/color.styled';
import Feather from '@expo/vector-icons/Feather';
import logger from '@/utils/logger';
import { ICantonAuthTokens, updateCantonAuthTokens } from '@/store/canton';
import { keyValueStore } from '@/db/keyValueStore';

interface CysyncData {
  wallets: IWallet[];
  accounts: IAccount[];
  cantonAuthTokens?: ICantonAuthTokens;
}

export default function Scan() {
  const { strings } = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
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
      runOnJS(processQrData)(scannedData.current);
    }
  }

  const reset = () => {
    setDecodedData(undefined);
    scannedData.current = {};
    setChunksReceived(0);
    setTotalChunks(0);
  };

  async function processQrData(qrData: Record<number, string>) {
    try {
      const sortedChunks = Object.keys(qrData)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => qrData[Number(key)]);

      const completeData = sortedChunks.join('');
      const buffer = Buffer.from(completeData, 'base64');
      const decompressedData = inflate(new Uint8Array(buffer));
      const decodedData = Buffer.from(decompressedData).toString();
      const parsedData = JSON.parse(decodedData) as CysyncData;
      setDecodedData(parsedData);
    } catch (error) {
      logger.error('Error processing QR Code', error as any);
      reset();
    }
  }

  useEffect(() => {
    progress.value = withSpring(chunksReceived / (totalChunks || 1), {
      damping: 20,
      stiffness: 90,
    });
  }, [chunksReceived, totalChunks]);

  async function saveDataToDb(data: CysyncData) {
    data.accounts = data.accounts.map(acc => {
      if (acc.extraData) {
        delete acc.extraData.lastInternalTransactionBlockHeight;
        delete acc.extraData.lastContractTransactionBlockHeight;
        delete acc.extraData.latestTransactionHash;
        delete acc.extraData.latestTransactionOffset;
        delete acc.extraData.lastConfirmedHash;
      }
      return acc;
    });
    try {
      const db = getDB();
      await db.clear();

      if (
        data.cantonAuthTokens?.accessToken &&
        data.cantonAuthTokens?.refreshToken
      ) {
        await keyValueStore.cantonAuthTokens.set(data.cantonAuthTokens);
        dispatch(
          updateCantonAuthTokens({
            cantonAuthTokens: data.cantonAuthTokens,
          }),
        );
      }

      await Promise.all([
        db.wallet.insert(data.wallets),
        db.account.insert(data.accounts),
      ]);
    } catch (error) {
      logger.error('Error saving data to DB:', error as any);
    }
  }

  useEffect(() => {
    let isCancelled = false;

    const persistAndNavigate = async () => {
      if (!decodedData) return;

      await saveDataToDb(decodedData);

      if (!isCancelled) {
        navigateToNext();
      }
    };

    void persistAndNavigate();

    return () => {
      isCancelled = true;
    };
  }, [decodedData]);

  useFocusEffect(useCallback(() => reset, []));

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
