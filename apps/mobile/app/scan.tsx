import { View, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Icon,
  MessageBox,
  ScreenContainer,
  Typography,
} from '@/components/ui';

import { Scanner } from '@/components/core';
import IonIcon from '@expo/vector-icons/Ionicons';
import { Images } from '@/constants/images';
import { router } from 'expo-router';
import { ScanningResult } from 'expo-camera';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useRealm } from '@realm/react';
import { LinearGradient } from 'expo-linear-gradient';
import { LottieSplash } from '@/components/ui/molecules/LottieSplash';
import helloAnimation from '@/assets/lottie/success-2.json';

const { width } = Dimensions.get('window');

interface WalletData {
  name: string;
  walletId: string;
  walletName: string;
  xpubOrAddress: string;
}

export default function Scan() {
  const { strings } = useAppSelector(selectLanguage);
  const scannedData = useRef<Record<number, string>>({});
  const [decodedData, setDecodedData] = useState<WalletData[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanningComplete, setIsScanningComplete] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const realm = useRealm();

  function onQrScanned(qr: ScanningResult) {
    const data = qr.data.split('|');
    const chunkIndex = Number(data[1]);
    const dataLength = Number(data[2]);
    const chunkData = data[3];

    scannedData.current[chunkIndex] = chunkData;

    const currentProgress =
      (Object.keys(scannedData.current).length / dataLength) * 100;
    setScanProgress(currentProgress);

    if (currentProgress === 100) {
      setIsScanningComplete(true);
    }

    if (Object.keys(scannedData.current).length === dataLength) {
      const sortedChunks = Object.keys(scannedData.current)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => scannedData.current[Number(key)]);

      const completeData = sortedChunks.join('');
      setDecodedData(JSON.parse(completeData) as WalletData[]);
    }
  }

  useEffect(() => {
    if (isScanningComplete) {
      setShowAnimation(true);
    }
  }, [isScanningComplete]);

  useEffect(() => {
    if (decodedData.length > 0) {
      realm.write(() => {
        decodedData.forEach(data => {
          const existingWallet = realm
            .objects('Wallet')
            .filtered('walletId == $0', data.walletId)[0];
          if (existingWallet) {
            existingWallet.name = data.name;
            existingWallet.walletName = data.walletName;
            existingWallet.xpubOrAddress = data.xpubOrAddress;
          } else {
            realm.create('Wallet', {
              _id: new Realm.BSON.ObjectId(),
              name: data.name,
              walletId: data.walletId,
              walletName: data.walletName,
              xpubOrAddress: data.xpubOrAddress,
              balance: 0,
              currency: '',
              createdAt: new Date(),
            });
          }
        });
      });
      realm.write(() => {
        decodedData.forEach(data => {
          const existingAccount = realm
            .objects('Account')
            .filtered('walletId == $0', data.walletId)[0];
          if (existingAccount) {
            existingAccount.name = data.name;
            existingAccount.walletName = data.walletName;
            existingAccount.xpubOrAddress = data.xpubOrAddress;
          } else {
            realm.create('Account', {
              _id: new Realm.BSON.ObjectId(),
              name: data.name,
              walletId: data.walletId,
              walletName: data.walletName,
              xpubOrAddress: data.xpubOrAddress,
              balance: 0,
              createdAt: new Date(),
            });
          }
        });
      });
    }
  }, [decodedData, realm]);

  useEffect(() => {
    if (showAnimation) {
      router.replace('/(onboarding)/info');
    }
  }, [showAnimation]);
  if (showAnimation) {
    return <LottieSplash source={helloAnimation} autoPlay loop={false} />;
  }

  return (
    <ScreenContainer>
      <View style={styles.top}>
        <Icon
          source={{
            default: Images.icon.close_default,
            disabled: Images.icon.close_disabed,
          }}
          onPress={() => router.replace('/(onboarding)/info')}
          size="small"
        />
      </View>
      <Scanner onQrScanned={onQrScanned} />
      <View style={styles.progressContainer}>
        <Typography
          type="body"
          color="secondary"
          textAlign="center"
          style={{ paddingBottom: 4 }}
        >
          {strings.scan.pleaseWait}
        </Typography>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={['#E9B873', '#FEDD8F', '#B78D51']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${scanProgress}%`,
              height: 5,
            }}
          />
        </View>
      </View>
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
  progressBarContainer: {
    width: '80%',
    height: 5,
    backgroundColor: '#272320',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressContainer: {
    gap: 4,
    marginTop: -20,
    paddingHorizontal: 24,
    width: '100%',
  },
});
