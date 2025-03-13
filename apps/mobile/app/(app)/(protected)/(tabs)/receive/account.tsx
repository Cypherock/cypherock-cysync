import {
  Card,
  Container,
  IInteractiveItemListItem,
  InteractiveItem,
  LoaderScreen,
  ScreenContainer,
  Search,
  Seperator,
  Typography,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';
import { useAccountList } from '@/hooks/useAccountList';
import { useDeriveAddress } from '@/hooks/useDeriveAddress';
import { useCallback, useEffect, useRef, useState } from 'react';
import { searchInItems } from '@/utils';
import { useReceiveContext } from '@/contexts/useReceiveContext';

export default function Account() {
  const { accountList, selectedAccount, handleAccountChange } =
    useReceiveContext();
  const { strings } = useAppSelector(selectLanguage);
  const [search, setSearch] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(accountList);

  const getAccountItem = ({ item }: { item: IInteractiveItemListItem }) => (
    <InteractiveItem
      key={item.id}
      leftIcon={item.leftIcon}
      text={item.text}
      tag={item.tag}
      rightText={item.rightText}
      onPress={() => {
        handleAccountChange(item.id);
        router.push('/receive/address');
      }}
      selected={selectedAccount?.__id == item.id}
    />
  );

  useEffect(() => {
    if (search.length === 0) {
      setFilteredAccounts(accountList);
      return;
    }
    setFilteredAccounts(searchInItems(accountList, search));
  }, [search, accountList]);

  return (
    <ScreenContainer>
      <Container style={{ padding: 16, gap: 24 }}>
        <Typography type="h3" style={{ textAlign: 'left' }}>
          {strings.receive.chooseAccount.title}
        </Typography>
        <Search onChange={v => setSearch(v)} value={search} />
        <Card
          style={{
            flex: filteredAccounts.length > 7 ? 1 : 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
        >
          {filteredAccounts.length > 0 ? (
            <FlatList
              style={{ width: '100%' }}
              data={filteredAccounts}
              renderItem={getAccountItem}
              ItemSeparatorComponent={() => <Seperator />}
            />
          ) : (
            <Typography type="para" style={{ paddingVertical: 24 }}>
              {strings.receive.shared.noAccounts}
            </Typography>
          )}
        </Card>
      </Container>
    </ScreenContainer>
  );
}
