import { CoinFamily } from '@cypherock/coins';
import { Container, TabContentContainer, Tabs } from '@cypherock/cysync-ui';
import React from 'react';

import { useSendDialog } from '~/dialogs/Send/context';
import { selectLanguage, useAppSelector } from '~/store';

import { BatchTransaction } from './BatchTransaction';
import { SingleTransaction } from './SingleTransaction';

interface AnaProps {
  disableInputs?: boolean;
}
const BitcoinAddressAndAmount: React.FC<AnaProps> = ({ disableInputs }) => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;
  const tabs = [
    {
      label: displayText.tabs.single,
      content: (
        <TabContentContainer>
          <SingleTransaction disableInputs={disableInputs} />
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

const EvmAddressAndAmount: React.FC<AnaProps> = ({ disableInputs }) => (
  <Container px={5} py="12px">
    <SingleTransaction disableInputs={disableInputs} />
  </Container>
);

const SolanaAddressAndAmount: React.FC<AnaProps> = ({ disableInputs }) => (
  <Container px={5} py="12px">
    <SingleTransaction disableInputs={disableInputs} />
  </Container>
);

const defaultAnaProps = {
  disableInputs: undefined,
};

BitcoinAddressAndAmount.defaultProps = defaultAnaProps;
EvmAddressAndAmount.defaultProps = defaultAnaProps;
SolanaAddressAndAmount.defaultProps = defaultAnaProps;

const anaInputMap: Record<CoinFamily, React.FC<any>> = {
  bitcoin: BitcoinAddressAndAmount,
  evm: EvmAddressAndAmount,
  solana: SolanaAddressAndAmount,
  near: SolanaAddressAndAmount,
  starknet: SolanaAddressAndAmount,
};

const getAnaComponent = (coinFamily: CoinFamily, props: AnaProps) => {
  const Component = anaInputMap[coinFamily];
  return <Component {...props} />;
};

export const AddressAndAmountSection: React.FC<AnaProps> = props => {
  const { selectedAccount } = useSendDialog();

  return getAnaComponent(selectedAccount?.familyId as any, props);
};
