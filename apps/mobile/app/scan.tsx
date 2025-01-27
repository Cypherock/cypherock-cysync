import { View, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Icon, MessageBox, Scanner, ScreenContainer } from '@/components/ui';
import IonIcon from '@expo/vector-icons/Ionicons';
import { Images } from '@/constants/images';
import { router } from 'expo-router';
import { ScanningResult } from 'expo-camera';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useRealm } from '@realm/react';

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
  const realm = useRealm();

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
      setDecodedData(JSON.parse(completeData) as WalletData[]);
    }
  }

  useEffect(() => {
    if (decodedData.length > 0) {
      decodedData.forEach(data => {
        realm.write(() => {
          realm.delete(realm.objects('Wallet'));
          realm.create('Wallet', {
            __id: new Realm.BSON.ObjectId().toHexString(),
            name: data.name,
            walletId: data.walletId,
            walletName: data.walletName,
            xpubOrAddress: data.xpubOrAddress,
            hasPin: false,
            hasPassphrase: false,
            deviceId: 'mockDeviceId',
          });
        });
        realm.write(() => {
          realm.delete(realm.objects('Account'));
          realm.create('Account', {
            __id: new Realm.BSON.ObjectId().toHexString(),
            name: data.name,
            walletId: data.walletId,
            walletName: data.walletName,
            xpubOrAddress: data.xpubOrAddress,
            balance: '0',
            spendableBalance: '0',
            unit: 'BTC',
            derivationScheme: 'BIP44',
            derivationPath: "m/44'/0'/0'/0",
            type: 'bitcoin',
            extraData: '{}',
            assetId: 'bitcoin',
            familyId: 'bitcoin',
            parentAssetId: 'bitcoin',
            parentAccountId: 'bitcoin',
            isHidden: false,
          });
        });
      });
      router.dismissTo('/receive/wallet');
    }
  }, [decodedData, realm]);

  return (
    <ScreenContainer>
      <View style={styles.top}>
        <Icon
          source={{
            default: Images.icon.close_default,
            disabled: Images.icon.close_disabed,
          }}
          onPress={() => router.dismiss()}
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
