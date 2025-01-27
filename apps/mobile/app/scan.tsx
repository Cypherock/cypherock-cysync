import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Icon, MessageBox, Scanner, ScreenContainer } from '@/components/ui';
import IonIcon from '@expo/vector-icons/Ionicons';
import { Images } from '@/constants/images';
import { router } from 'expo-router';
import { ScanningResult } from 'expo-camera';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { getDB } from '@/db';

interface WalletData {
  wallets: IWallet[];
  accounts: IAccount[];
}

export default function Scan() {
  const { strings } = useAppSelector(selectLanguage);
  const scannedData = useRef<Record<number, string>>({});
  const [decodedData, setDecodedData] = useState<WalletData>();

  function navigateToNext() {
    router.dismissTo('/receive/wallet');
  }

  function onQrScanned(qr: ScanningResult) {
    const data = qr.data.split('|');
    const chunkIndex = Number(data[1]);
    const dataLength = Number(data[2]);
    const chunkData = data[3];

    scannedData.current[chunkIndex] = chunkData;

    if (Object.keys(scannedData.current).length === dataLength) {
      const sortedChunks = Object.keys(scannedData.current)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => scannedData.current[Number(key)]);

      const completeData = sortedChunks.join('');
      setDecodedData(JSON.parse(completeData) as WalletData);
    }
  }

  async function saveDataToDb(data: WalletData) {
    try {
      const db = await getDB();
      await db.wallet.insert(data.wallets[0]);
      await db.account.insert(data.accounts[0]);
    } catch (error) {
      console.log(error);
      console.log('Failed to save data');
    }
  }

  useEffect(() => {
    if (decodedData) {
      saveDataToDb(decodedData);
      navigateToNext();
    }
  }, [decodedData]);

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
        <MessageBox
          type="warning"
          icon={
            <IonIcon name="person-circle-outline" color={'#F1AE4A'} size={24} />
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
});
