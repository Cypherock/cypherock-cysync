import { CoinFamily } from '@cypherock/coins';
import { Container, TabContentContainer, Tabs } from '@cypherock/cysync-ui';
import React from 'react';

import { useSendDialog } from '~/dialogs/Send/context';
import { selectLanguage, useAppSelector } from '~/store';

import { BatchTransaction } from './BatchTransaction';
import { SingleTransaction } from './SingleTransaction';

interface AnaProps {
  disableInputs?: boolean;
  providerName?: string;
}
const BitcoinAddressAndAmount: React.FC<AnaProps> = ({
  disableInputs,
  providerName,
}) => {
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.send.recipient;

  if (disableInputs) {
    return (
      <Container px={5} py="12px">
        <SingleTransaction
          disableInputs={disableInputs}
          providerName={providerName}
        />
      </Container>
    );
  }

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

const EvmAddressAndAmount: React.FC<AnaProps> = ({
  disableInputs,
  providerName,
}) => (
  <Container px={5} py="12px">
    <SingleTransaction
      disableInputs={disableInputs}
      providerName={providerName}
    />
  </Container>
);

const SolanaAddressAndAmount: React.FC<AnaProps> = ({
  disableInputs,
  providerName,
}) => (
  <Container px={5} py="12px">
    <SingleTransaction
      disableInputs={disableInputs}
      providerName={providerName}
    />
  </Container>
);

const TronAddressAndAmount: React.FC<AnaProps> = ({
  disableInputs,
  providerName,
}) => (
  <Container px={5} py="12px">
    <SingleTransaction
      disableInputs={disableInputs}
      providerName={providerName}
    />
  </Container>
);

const XrpAddressAndAmount: React.FC<AnaProps> = ({
  disableInputs,
  providerName,
}) => (
  <Container px={5} py="12px">
    <SingleTransaction
      disableInputs={disableInputs}
      providerName={providerName}
    />
  </Container>
);

const StarknetAddressAndAmount: React.FC<AnaProps> = ({
  disableInputs,
  providerName,
}) => (
  <Container px={5} py="12px">
    <SingleTransaction
      disableInputs={disableInputs}
      providerName={providerName}
    />
  </Container>
);

const IcpAddressAndAmount: React.FC<AnaProps> = ({
  disableInputs,
  providerName,
}) => (
  <Container px={5} py="12px">
    <SingleTransaction
      disableInputs={disableInputs}
      providerName={providerName}
    />
  </Container>
);

const defaultAnaProps = {
  disableInputs: undefined,
  providerName: undefined,
};

BitcoinAddressAndAmount.defaultProps = defaultAnaProps;
EvmAddressAndAmount.defaultProps = defaultAnaProps;
SolanaAddressAndAmount.defaultProps = defaultAnaProps;
TronAddressAndAmount.defaultProps = defaultAnaProps;
XrpAddressAndAmount.defaultProps = defaultAnaProps;
StarknetAddressAndAmount.defaultProps = defaultAnaProps;
IcpAddressAndAmount.defaultProps = defaultAnaProps;

const anaInputMap: Record<CoinFamily, React.FC<any>> = {
  bitcoin: BitcoinAddressAndAmount,
  evm: EvmAddressAndAmount,
  solana: SolanaAddressAndAmount,
  near: SolanaAddressAndAmount,
  tron: TronAddressAndAmount,
  xrp: XrpAddressAndAmount,
  starknet: StarknetAddressAndAmount,
  icp: IcpAddressAndAmount,
};

const getAnaComponent = (coinFamily: CoinFamily, props: AnaProps) => {
  const Component = anaInputMap[coinFamily];
  return <Component {...props} />;
};

export const AddressAndAmountSection: React.FC<AnaProps> = props => {
  const { selectedAccount } = useSendDialog();

  return getAnaComponent(selectedAccount?.familyId as any, props);
};
