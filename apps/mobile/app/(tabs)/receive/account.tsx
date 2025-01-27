import {
  Card,
  Container,
  InteractiveItem,
  ScreenContainer,
  Search,
  Seperator,
  Typography,
  WalletIcon,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectAccounts } from '@/store/accounts';
import { selectLanguage } from '@/store/lang';
import { router } from 'expo-router';
import { FlatList } from 'react-native';

export default function Account() {
  const { strings } = useAppSelector(selectLanguage);
  const { accounts } = useAppSelector(selectAccounts);

  return (
    <ScreenContainer>
      <Container style={{ padding: 16, gap: 24 }}>
        <Typography type="h3" style={{ textAlign: 'left' }}>
          {strings.receive.chooseAccount.title}
        </Typography>
        <Search />
        <Card style={{ paddingHorizontal: 0, paddingVertical: 0 }}>
          <FlatList
            style={{ width: '100%' }}
            data={accounts}
            renderItem={({ item }) => (
              <InteractiveItem
                key={item._id}
                leftIcon={<WalletIcon />}
                text={item.name}
                tag={item.walletName}
                onPress={() => router.push('/receive/address')}
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
