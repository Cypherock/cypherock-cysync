import React from 'react';
import {
  Card,
  Container,
  InteractiveItem,
  ScreenContainer,
  Seperator,
  Typography,
  WalletIcon,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { selectWallets } from '@/store/wallets';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';

export default function Wallet() {
  const { strings } = useAppSelector(selectLanguage);
  const { wallets } = useAppSelector(selectWallets);

  if (wallets.length == 0) {
    return (
      <NoDataScreen
        title={strings.portfolio.noAccount.title}
        description={strings.portfolio.noAccount.subTitle}
        onAction={() => router.push('/scan')}
        actionText={strings.buttons.scanQrCode}
      />
    );
  }

  return (
    <ScreenContainer>
      <Container style={styles.container}>
        <Typography type="h3" style={styles.title}>
          {strings.receive.chooseWallet.title}
        </Typography>
        <ScrollView>
          <Card style={styles.card}>
            {wallets.map((wallet, index) => (
              <React.Fragment key={wallet.__id}>
                <InteractiveItem
                  leftIcon={<WalletIcon />}
                  text={wallet.name}
                  onPress={() =>
                    router.push(
                      `/receive/account?walletId=${wallet.__id}&walletName=${wallet.name}`,
                    )
                  }
                />
                {index < wallets.length - 1 && <Seperator />}
              </React.Fragment>
            ))}
          </Card>
        </ScrollView>
      </Container>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
    gap: 16,
  },
  title: {
    textAlign: 'left',
    margin: 0,
    padding: 0,
    lineHeight: 24,
  },
  card: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
