import { CoinFamily } from '@cypherock/coins';
import { Container, TabContentContainer, Tabs } from '@cypherock/cysync-ui';
import React from 'react';

import { useSendDialog } from '~/dialogs/Send/context';
import { selectLanguage, useAppSelector } from '~/store';

import { BatchTransaction } from './BatchTransaction';
import { SingleTransaction } from './SingleTransaction';

const BitcoinAdressAndAmount: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;
  const tabs = [
    {
      label: displayText.tabs.single,
      content: (
        <TabContentContainer>
          <SingleTransaction />
        </TabContentContainer>
      ),
    },
    {
      label: displayText.tabs.batch,
      content: (
        <TabContentContainer>
          <BatchTransaction />
        </TabContentContainer>
      ),
    },
  ];
  return <Tabs tabs={tabs} />;
};

const EvmAddressAndAmount: React.FC = () => (
  <Container px={5} py="12px">
    {' '}
    <SingleTransaction />{' '}
  </Container>
);

const anaInputMap: Record<CoinFamily, React.FC<any>> = {
  bitcoin: BitcoinAdressAndAmount,
  evm: EvmAddressAndAmount,
  near: EvmAddressAndAmount,
  solana: EvmAddressAndAmount,
};

const getAnaComponent = (coinFamily: CoinFamily) => {
  const Component = anaInputMap[coinFamily];
  return <Component />;
};

export const AddressAndAmountSection: React.FC = () => {
  const { selectedAccount } = useSendDialog();

  return getAnaComponent(selectedAccount?.familyId as any);
};
