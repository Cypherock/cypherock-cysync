import {
  Card,
  Container,
  IInteractiveItemListItem,
  InteractiveItem,
  ScreenContainer,
  Search,
  Seperator,
  Typography,
} from '@/components/ui';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList } from 'react-native';
import { useAccountList } from '@/hooks/useAccountList';
import { useDeriveAddress } from '@/hooks/useDeriveAddress';
import { useCallback, useEffect } from 'react';

export default function Account() {
  const { walletId, walletName }: { walletId: string; walletName: string } =
    useLocalSearchParams();
  const { strings } = useAppSelector(selectLanguage);
  const { accountList, selectedAccount, handleAccountChange } = useAccountList({
    selectedWalletId: walletId,
  });
  const { derivedAddress } = useDeriveAddress({ selectedAccount });

  const onAddressDerived = useCallback(() => {
    if (selectedAccount && derivedAddress) {
      router.push(
        `/receive/address?accountName=${selectedAccount.name}&assetId=${selectedAccount.assetId}&parentAssetId=${selectedAccount.parentAssetId}&walletName=${walletName}&address=${derivedAddress}`,
      );
    }
  }, [selectedAccount, derivedAddress]);

  useEffect(() => {
    onAddressDerived();
  }, [derivedAddress, selectedAccount]);

  const getAccountItem = ({ item }: { item: IInteractiveItemListItem }) => (
    <InteractiveItem
      key={item.id}
      leftIcon={item.leftIcon}
      text={item.text}
      tag={item.tag}
      rightText={item.rightText}
      onPress={() => {
        handleAccountChange(item.id);
      }}
      selected={selectedAccount?.__id == item.id}
    />
  );

  if (accountList.length === 0) {
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
      <Container style={{ padding: 16, gap: 24 }}>
        <Typography type="h3" style={{ textAlign: 'left' }}>
          {strings.receive.chooseAccount.title}
        </Typography>
        <Search />
        <Card style={{ paddingHorizontal: 0, paddingVertical: 0 }}>
          <FlatList
            style={{ width: '100%' }}
            data={accountList}
            renderItem={getAccountItem}
            ItemSeparatorComponent={() => <Seperator />}
          />
        </Card>
      </Container>
    </ScreenContainer>
  );
}
