import {
  Card,
  Container,
  Copy,
  LangDisplay,
  MessageBox,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { colors } from '@/components/ui/themes/color.styled';
import Octicons from '@expo/vector-icons/Octicons';
import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { View } from 'react-native';

export default function Receive() {
  const { walletName, accountName, address } = useLocalSearchParams();
  const { strings } = useAppSelector(selectLanguage);
  const [copied, setCopied] = useState(false);

  const derivedAddress = Array.isArray(address) ? address[0] : address;

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
                  {accountName}
                </Typography>
              ),
              wallet: (
                <Typography type="para" color="primary">
                  {walletName}
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
