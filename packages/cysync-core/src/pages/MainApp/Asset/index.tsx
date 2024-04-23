import {
  Typography,
  Breadcrumb,
  Button,
  Container,
  Flex,
  ArrowSentIcon,
  ArrowReceivedIcon,
  SvgProps,
  WalletConnectWithBgIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  openReceiveDialog,
  openSendDialog,
  openWalletConnectDialog,
} from '~/actions';
import {
  AssetAllocation,
  CoinIcon,
  Graph,
  TransactionTable,
} from '~/components';
import { routes } from '~/constants';
import { supportedWalletConnectFamilies } from '~/context';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { useAssetPage } from '../hooks';
import { MainAppLayout } from '../Layout';

const ReceiveIcon = (props: SvgProps) => (
  <ArrowReceivedIcon {...props} $width="12px" $height="12px" />
);

const SendIcon = (props: SvgProps) => (
  <ArrowSentIcon {...props} $width="12px" $height="12px" />
);

export const AssetPage: FC = () => {
  const navigateTo = useNavigateTo();
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const {
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    onAccountClick,
    selectedAsset,
    assetId,
    parentAssetId,
    assetDropdownList,
    onAssetChange,
  } = useAssetPage();

  return (
    <MainAppLayout
      topbar={{
        title: selectedAsset?.name ?? '',
        icon: (
          <CoinIcon
            parentAssetId={parentAssetId ?? ''}
            assetId={assetId}
            size={{ def: '24px', lg: '32px' }}
            containerSize={{ def: '32px', lg: '40px' }}
            withBackground
            withParentIconAtBottom
            subIconSize={{ def: '12px', lg: '18px' }}
            subContainerSize={{ def: '12px', lg: '18px' }}
          />
        ),
      }}
    >
      <Container $noFlex m="20">
        <Flex justify="space-between" my={2}>
          <Breadcrumb
            items={[
              {
                id: 'portfolio',
                text: lang.strings.portfolio.title,
                onClick: () => navigateTo(routes.portfolio.path),
              },
              {
                id: 'asset',
                dropdown: {
                  displayNode: (
                    <Container direction="row">
                      <CoinIcon
                        parentAssetId={parentAssetId ?? ''}
                        assetId={assetId}
                        withParentIconAtBottom
                        subIconSize="8px"
                        subContainerSize="12px"
                        size="16px"
                      />
                      <Typography ml={1}>{selectedAsset?.name}</Typography>
                    </Container>
                  ),
                  selectedItem: `${parentAssetId}/${assetId}`,
                  setSelectedItem: onAssetChange,
                  dropdown: assetDropdownList,
                },
              },
            ]}
          />
          <Flex gap={8}>
            <Button
              variant="secondary"
              onClick={() => dispatch(openSendDialog())}
              size="sm"
              display="flex"
              justify="center"
              align="center"
              iconComponent={SendIcon}
            >
              {lang.strings.buttons.send}
            </Button>
            <Button
              variant="secondary"
              onClick={() => dispatch(openReceiveDialog())}
              size="sm"
              display="flex"
              justify="center"
              align="center"
              iconComponent={ReceiveIcon}
            >
              {lang.strings.buttons.receive}
            </Button>
            {supportedWalletConnectFamilies.includes(
              selectedAsset?.family ?? '',
            ) && (
              <Container pl={{ def: 0, mdlg: 4 }}>
                <Button
                  variant="icon"
                  onClick={() => {
                    dispatch(openWalletConnectDialog());
                  }}
                >
                  <WalletConnectWithBgIcon />
                </Button>
              </Container>
            )}
          </Flex>
        </Flex>

        <Container $noFlex mb={2}>
          <Graph
            selectedWallet={selectedWallet}
            handleWalletChange={handleWalletChange}
            walletDropdownList={walletDropdownList}
            assetId={assetId}
            parentAssetId={parentAssetId}
            color={selectedAsset?.color}
          />
        </Container>

        <Container $noFlex mb={2}>
          <AssetAllocation
            assetId={assetId}
            parentAssetId={parentAssetId}
            walletId={selectedWallet?.__id}
            onRowClick={onAccountClick}
            withSubIconAtBottom
          />
        </Container>

        <Container $noFlex mb={2}>
          <TransactionTable
            limit={10}
            walletId={selectedWallet?.__id}
            assetId={assetId}
            parentAssetId={parentAssetId}
            variant="withNoAssetColumn"
          />
        </Container>
      </Container>
    </MainAppLayout>
  );
};
