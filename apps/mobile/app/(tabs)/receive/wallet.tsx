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
import { selectWallets } from '@/store/wallets';
import { router } from 'expo-router';
import { FlatList } from 'react-native';

export default function Wallet() {
  const { strings } = useAppSelector(selectLanguage);
  const { wallets } = useAppSelector(selectWallets);

  return (
    <ScreenContainer>
      <Container style={{ padding: 16, gap: 24 }}>
        <Typography type="h3" style={{ textAlign: 'left' }}>
          {strings.receive.chooseWallet.title}
        </Typography>
        <Card style={{ paddingHorizontal: 0, paddingVertical: 0 }}>
          <FlatList
            style={{ width: '100%' }}
            data={wallets}
            renderItem={({ item }) => (
              <InteractiveItem
                key={item._id}
                leftIcon={<WalletIcon />}
                text={item.walletName}
                onPress={() => router.push('/receive/account')}
              />
            )}
            keyExtractor={item => item._id}
            ItemSeparatorComponent={() => <Seperator />}
          />
        </Card>
      </Container>
    </ScreenContainer>
  );
}
