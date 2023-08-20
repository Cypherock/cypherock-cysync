import { coinList } from '@cypherock/coins';
import {
  LangDisplay,
  Typography,
  Container,
  CopyContainer,
  InputLabel,
  Flex,
  Tag,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React from 'react';
import QRCode from 'react-qr-code';

import { CoinIcon } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';

export const AddressDisplay: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { selectedAccount, selectedWallet, derivedAddress } =
    useReceiveDialog();

  const texts = lang.strings.receive.receive;

  return (
    <>
      <Flex gap={5} direction="column">
        <Flex gap={8} direction="row">
          <Typography variant="h5" width="100%">
            <LangDisplay text={texts.title.prefix} />
          </Typography>
          <CoinIcon assetId={selectedAccount?.assetId ?? ''} size={32} />
          <Typography variant="h5" width="100%">
            <LangDisplay text={coinList[selectedAccount?.assetId ?? ''].name} />
          </Typography>
          <Tag $fontSize={12}>
            {lodash.upperCase(selectedAccount?.derivationScheme)}
          </Tag>
        </Flex>
        <Typography variant="h5" width="100%" ml="auto" mr="auto">
          <LangDisplay
            text={texts.title.suffix}
            variables={{ walletName: selectedWallet?.name }}
          />
        </Typography>
      </Flex>
      <Container $bgColor="white" p="12">
        <QRCode size={228} value={derivedAddress ?? ''} />
      </Container>
      <Container
        display="flex"
        direction="column"
        width="full"
        gap={5}
        justify="flex-start"
      >
        <InputLabel mb={0}>{texts.addressLabel}</InputLabel>
        <CopyContainer link={derivedAddress ?? ''} variant="gold" />
      </Container>
    </>
  );
};
