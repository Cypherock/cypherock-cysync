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
import { getDB } from '@/db';
import { useAppSelector } from '@/store';
import { selectAccounts } from '@/store/accounts';
import { selectLanguage } from '@/store/lang';
import { getCoinSupport } from '@cypherock/coin-support';
import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import { IAccount } from '@cypherock/db-interfaces';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { Subscription, Observer } from 'rxjs';

export default function Account() {
  const { walletId, walletName }: { walletId: string; walletName: string } =
    useLocalSearchParams();
  const { strings } = useAppSelector(selectLanguage);
  const { accounts } = useAppSelector(selectAccounts);
  const [selectedAccount, setSelectedAccount] = useState<
    IAccount | undefined
  >();
  const [derivedAddress, setDerivedAddress] = useState('');

  const flowSubscription = useRef<Subscription | undefined>();

  const onError = (err: any) => {
    throw err;
  };

  const onEnd = () => {
    if (selectedAccount && derivedAddress) {
      router.push(
        `/receive/address?accountName=${selectedAccount.name}&walletName=${walletName}&address=${derivedAddress}`,
      );
    }
  };

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
    },
    complete: () => {
      onEnd();
      cleanUp();
    },
  });

  async function getWalletAddress(account: IAccount) {
    try {
      setSelectedAccount(account);
      const coinSupport = getCoinSupport(account.familyId);
      const subscription = coinSupport
        .receive({
          accountId: account.__id ?? '',
          db: await getDB(),
        })
        .subscribe(getFlowObserver(onEnd));
      flowSubscription.current = subscription;
    } catch (error) {
      console.log(error);
      console.log('Failed to derive address');
    }
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
            data={accounts.filter(ac => ac.walletId == walletId)}
            renderItem={({ item }) => (
              <InteractiveItem
                key={item.__id}
                leftIcon={<WalletIcon />}
                text={item.name}
                tag={item.unit}
                onPress={() => {
                  getWalletAddress(item);
                }}
              />
            )}
            ItemSeparatorComponent={() => <Seperator />}
          />
        </Card>
      </Container>
    </ScreenContainer>
  );
}
