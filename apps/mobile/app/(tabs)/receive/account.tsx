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
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';

export default function Account() {
  const { walletId } = useLocalSearchParams();
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
            data={accounts.filter(ac => ac.walletId == walletId)}
            renderItem={({ item }) => (
              <InteractiveItem
                key={item._id}
                leftIcon={<WalletIcon />}
                text={item.name}
                tag={item.walletName}
                onPress={() =>
                  router.push(
                    `/receive/address?accountName=${item.name}&walletName=${item.walletName}&address=0xe0A4568d7F15e7EeF2194CC8cA507C2fD17C63D6`,
                  )
                }
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
