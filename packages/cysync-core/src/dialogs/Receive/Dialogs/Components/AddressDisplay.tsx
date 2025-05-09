import { getAsset } from '@cypherock/coin-support-utils';
import {
  LangDisplay,
  Typography,
  Container,
  CopyContainer,
  InputLabel,
  Flex,
  Tag,
  LeanBox,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useMemo } from 'react';
import QRCode from 'react-qr-code';

import { CoinIcon } from '~/components';

import { useReceiveDialog, ReceiveFlowSource } from '../../context';

interface AddressDisplayProps {
  titlePrefix: string;
  titleSuffix: string;
  addressLabel: string;
  address: string;
}

export const AddressDisplay: React.FC<AddressDisplayProps> = ({
  titlePrefix,
  titleSuffix,
  addressLabel,
  address,
}) => {
  const { selectedAccount, selectedWallet, source } = useReceiveDialog();

  const asset = useMemo(
    () =>
      getAsset(selectedAccount?.parentAssetId ?? '', selectedAccount?.assetId),
    [selectedAccount],
  );

  return (
    <>
      <Flex gap={5} direction="column">
        <Flex gap={8} direction="row">
          <Typography variant="h5">
            <LangDisplay text={titlePrefix} />
          </Typography>
          <CoinIcon
            parentAssetId={selectedAccount?.parentAssetId ?? ''}
            assetId={selectedAccount?.assetId ?? ''}
            withParentIconAtBottom
            subContainerSize="17px"
            subIconSize="16px"
            size={32}
          />
          <Typography variant="h5">
            <LangDisplay text={asset.name} />
          </Typography>
          {selectedAccount?.derivationScheme && (
            <Tag $fontSize={12}>
              {lodash.upperCase(selectedAccount.derivationScheme)}
            </Tag>
          )}
        </Flex>
        <Typography variant="h5" ml="auto" mr="auto">
          <LangDisplay
            text={titleSuffix}
            variables={{ walletName: selectedWallet?.name }}
          />
        </Typography>
      </Flex>
      {source === ReceiveFlowSource.DEFAULT && (
        <Container $bgColor="white" p="12">
          <QRCode size={228} value={address} />
        </Container>
      )}
      <Container
        display="flex"
        direction="column"
        width="full"
        gap={5}
        justify="flex-start"
      >
        <InputLabel mb={0}>{addressLabel}</InputLabel>
        {source === ReceiveFlowSource.DEFAULT ? (
          <CopyContainer link={address} variant="gold" />
        ) : (
          <LeanBox text={address} />
        )}
      </Container>
    </>
  );
};
