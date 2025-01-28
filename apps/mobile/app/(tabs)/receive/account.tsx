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
import { getDB } from '@/db';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { getCoinSupport } from '@cypherock/coin-support';
import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Subscription, Observer } from 'rxjs';
import { useAccountList } from '@/hooks/useAccountList';

export default function Account() {
  const { walletId, walletName }: { walletId: string; walletName: string } =
    useLocalSearchParams();
  const { strings } = useAppSelector(selectLanguage);
  const [derivedAddress, setDerivedAddress] = useState('');

  const { accountList, selectedAccount, handleAccountChange } = useAccountList({
    selectedWalletId: walletId,
  });

  const flowSubscription = useRef<Subscription | undefined>();

  const onError = (err: any) => {
    throw err;
  };

  const onEnd = useCallback(() => {
    if (selectedAccount && derivedAddress) {
      router.push(
        `/receive/address?accountName=${selectedAccount.name}&assetId=${selectedAccount.assetId}&parentAssetId=${selectedAccount.parentAssetId}&walletName=${walletName}&address=${derivedAddress}`,
      );
    }
  }, [selectedAccount, derivedAddress]);

  const cleanUp = () => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  };

  const getFlowObserver = (onEnd: () => void): Observer<IReceiveEvent> => ({
    next: payload => {
      if (payload.address) {
        setDerivedAddress(payload.address);
      }
    },
    error: err => {
      onError(err);
      cleanUp();
    },
    complete: () => {
      if (derivedAddress) {
        onEnd();
      }
      cleanUp();
    },
  });

  const getWalletAddress = useCallback(async () => {
    try {
      if (!selectedAccount) return;
      const coinSupport = getCoinSupport(selectedAccount.familyId);
      const subscription = coinSupport
        .receive({
          accountId: selectedAccount.__id ?? '',
          db: await getDB(),
        })
        .subscribe(getFlowObserver(onEnd));
      flowSubscription.current = subscription;
    } catch (error) {
      console.log(error);
      console.log('Failed to derive address');
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedAccount) {
      getWalletAddress();
    }
    return cleanUp;
  }, [selectedAccount]);

  useEffect(() => {
    onEnd();
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
