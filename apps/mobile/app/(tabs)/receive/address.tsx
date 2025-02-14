import {
  Card,
  Container,
  Copy,
  LangDisplay,
  LoaderScreen,
  MessageBox,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import Octicons from '@expo/vector-icons/Octicons';
import { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';
import { CoinIcon } from '@/components/core';
import { useReceiveContext } from '@/contexts/useReceiveContext';

export default function Receive() {
  const {
    selectedAccount,
    derivedAddress,
    selectedWallet,
    resetReceiveData,
    isLoading,
  } = useReceiveContext();
  const { strings } = useAppSelector(selectLanguage);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      resetReceiveData();
    };
  }, []);

  if (!derivedAddress || isLoading) {
    return (
      <LoaderScreen title="Please wait while we are fetching your details" />
    );
  }

  const handleCopy = async () => {
    await Clipboard.setStringAsync(derivedAddress);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <ScreenContainer>
      <Container style={{ padding: 16, gap: 24 }}>
        <Typography type="para">
          <LangDisplay
            text={strings.receive.receive.info}
            variables={{
              crypto: (
                <Typography type="para" color="primary">
                  <CoinIcon
                    parentAssetId={selectedAccount.parentAssetId}
                    assetId={selectedAccount.assetId}
                    size={16}
                  />{' '}
                  {selectedAccount.name}
                </Typography>
              ),
              wallet: (
                <Typography type="para" color="primary">
                  {selectedWallet?.name}
                </Typography>
              ),
            }}
          />
        </Typography>
        <Container
          style={{
            gap: 16,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{ backgroundColor: 'white', padding: 10, borderRadius: 8 }}
          >
            <QRCode value={derivedAddress} size={151} />
          </View>
          <Card
            borderColor="secondary"
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <Typography type="para" style={{ textAlign: 'left' }}>
              {derivedAddress}
            </Typography>
            <Copy onPress={handleCopy} copied={copied} />
          </Card>
        </Container>
        <MessageBox
          type="danger"
          icon={<Octicons name="info" size={16} color={colors.text.error} />}
          text={strings.receive.receive.messageBox.danger}
        />
      </Container>
    </ScreenContainer>
  );
}
