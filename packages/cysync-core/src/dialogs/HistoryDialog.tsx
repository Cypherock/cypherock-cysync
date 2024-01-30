import { formatAddress } from '@cypherock/cysync-core-services';
import {
  BlurOverlay,
  Chip,
  Clipboard,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxHeader,
  Divider,
  Flex,
  GoldExternalLink,
  NestedContainer,
  ScrollableContainer,
  SummaryContainer,
  Tag,
  ThemeType,
  Typography,
  useTheme,
} from '@cypherock/cysync-ui';
import {
  ITransaction,
  TransactionStatus,
  TransactionStatusMap,
} from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, useMemo } from 'react';

import { mapTransactionForDisplay } from '~/hooks';
import {
  closeDialog,
  openSnackBar,
  selectDiscreetMode,
  selectLanguage,
  selectPriceInfos,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';

export interface IHistoryDialogProps {
  txn: ITransaction;
}

const textColorMap: any = {
  success: 'success',
  failed: 'error',
  pending: 'warn',
};

const HistoryItem = ({
  leftText,
  children,
}: {
  leftText: string;
  children: React.ReactNode;
}) => (
  <>
    <SummaryContainer
      leftComponent={
        <Typography variant="span" color="muted">
          {leftText}
        </Typography>
      }
      rightComponent={children}
    />
    <Divider variant="horizontal" $bgColor="dialog" />
  </>
);

const getFillFromStatus = (status: TransactionStatus, theme: ThemeType) => {
  const map: Record<TransactionStatus, string> = {
    [TransactionStatusMap.success]: theme.palette.text.success,
    [TransactionStatusMap.pending]: theme.palette.text.warn,
    [TransactionStatusMap.failed]: theme.palette.text.error,
  };

  return map[status];
};

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectUnHiddenAccounts,
    selectPriceInfos,
    selectDiscreetMode,
  ],
  (
    lang,
    { wallets },
    { accounts },
    { priceInfos },
    { active: isDiscreetMode },
  ) => ({
    lang,
    wallets,
    accounts,
    priceInfos,
    isDiscreetMode,
  }),
);

export const HistoryDialog: FC<IHistoryDialogProps> = ({ txn }) => {
  const { lang, wallets, accounts, priceInfos, isDiscreetMode } =
    useAppSelector(selector);
  const keys = lang.strings.history.dialogBox;
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const displayTransaction = useMemo(
    () =>
      mapTransactionForDisplay({
        transaction: txn,
        isDiscreetMode,
        priceInfos,
        wallets,
        accounts,
        lang,
      }),
    [txn, wallets, accounts, lang, priceInfos, isDiscreetMode],
  );

  const onClose = () => dispatch(closeDialog('historyDialog'));

  const handleTransactionHashCopy = () => {
    dispatch(
      openSnackBar({
        icon: 'check',
        text: lang.strings.snackbar.copiedToClipboard,
      }),
    );
  };

  const getFeePrefix = () => (keys.feePrefix as any)[txn.assetId] ?? '';

  const formatTxnAddress = (address: string, index: number, total: number) => {
    const formattedAddress = formatAddress({
      address,
      coinId: txn.parentAssetId,
      familyId: txn.familyId,
    });

    let str = formattedAddress;
    if (total > 1) {
      str = `${index + 1}. ${formattedAddress})`;
    }

    return str;
  };

  return (
    <BlurOverlay>
      <DialogBox width={700} onClose={onClose}>
        <DialogBoxHeader height={56} width={700}>
          <Flex width="full" justify="flex-end">
            <CloseButton onClick={onClose} />
          </Flex>
        </DialogBoxHeader>
        <DialogBoxBody
          align="center"
          direction="column"
          height="full"
          pr={0}
          pb={0}
        >
          <displayTransaction.icon
            width="56px"
            height="48px"
            fill={getFillFromStatus(displayTransaction.status, theme)}
          />
          <Container
            display="flex"
            direction="column"
            align="center"
            width="full"
            gap={12}
          >
            <Container
              display="flex"
              direction="column"
              align="center"
              width="full"
              gap={4}
            >
              <Typography variant="h5">
                {displayTransaction.displayAmount}
              </Typography>
              <Typography variant="span" color="muted">
                {displayTransaction.dateTime}
              </Typography>
            </Container>
            <a
              href={displayTransaction.explorerLink}
              target="_blank"
              style={{ textDecoration: 'none' }}
              rel="noreferrer"
            >
              <Container
                display="flex"
                align="center"
                width="full"
                direction="row"
                gap={8}
              >
                <Typography variant="span" $fontSize={14} color="gold">
                  {keys.view}
                </Typography>
                <GoldExternalLink width="15px" height="12px" />
              </Container>
            </a>
          </Container>
          <ScrollableContainer $maxHeight="calc(100vh - 400px)">
            <Container
              display="flex"
              direction="column"
              width="full"
              pt={5}
              pr={5}
              pb={3}
              gap={12}
            >
              <HistoryItem leftText={keys.value}>
                <Typography
                  variant="span"
                  $maxWidth="400"
                  $textOverflow="ellipsis"
                >
                  {displayTransaction.displayValue}
                </Typography>
              </HistoryItem>
              <HistoryItem leftText={getFeePrefix() + keys.fee}>
                <NestedContainer>
                  <Typography
                    variant="span"
                    $maxWidth="400"
                    $textOverflow="ellipsis"
                  >
                    {displayTransaction.displayFee}
                  </Typography>
                  <Typography
                    variant="span"
                    $fontSize={14}
                    color="normal"
                    $maxWidth="400"
                    $textOverflow="ellipsis"
                  >
                    = {displayTransaction.displayFeeValue}
                  </Typography>
                </NestedContainer>
              </HistoryItem>
              <HistoryItem leftText={keys.type}>
                <Container direction="row" gap={8}>
                  <displayTransaction.icon
                    width="15px"
                    height="12px"
                    fill={theme.palette.text.white}
                  />
                  <Typography variant="span">
                    {displayTransaction.type.split(' ')[0]}
                  </Typography>
                </Container>
              </HistoryItem>
              <HistoryItem leftText={keys.status}>
                <Typography
                  variant="span"
                  color={textColorMap[displayTransaction.status]}
                >
                  {displayTransaction.statusText}
                </Typography>
              </HistoryItem>
              <HistoryItem leftText={keys.wallet}>
                <Typography
                  variant="span"
                  $maxWidth="400"
                  $textOverflow="ellipsis"
                >
                  {displayTransaction.walletName}
                </Typography>
              </HistoryItem>
              <HistoryItem leftText={keys.account}>
                <Container direction="row" gap={8}>
                  <displayTransaction.accountIcon width="24px" height="24px" />
                  <Typography
                    variant="span"
                    $maxWidth="400"
                    $textOverflow="ellipsis"
                  >
                    {displayTransaction.accountName}
                  </Typography>
                  {displayTransaction.accountTag && (
                    <Tag>{displayTransaction.accountTag}</Tag>
                  )}
                </Container>
              </HistoryItem>
              <HistoryItem leftText={keys.asset}>
                <Container direction="row" gap={8}>
                  <displayTransaction.assetIcon width="24px" height="24px" />
                  <Typography
                    variant="span"
                    $maxWidth="400"
                    $textOverflow="ellipsis"
                  >
                    {displayTransaction.assetName}
                  </Typography>
                </Container>
              </HistoryItem>
              <HistoryItem leftText={keys.sender}>
                <NestedContainer>
                  {displayTransaction.txn.inputs.map((input, i) => (
                    <Container
                      direction="row"
                      gap={8}
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${i}-${input.address}`}
                      mb={
                        i !== displayTransaction.txn.inputs.length - 1
                          ? '4'
                          : '0'
                      }
                    >
                      {input.isMine && (
                        <Chip>
                          <Typography
                            variant="p"
                            $fontSize={14}
                            $fontWeight="medium"
                            color="muted"
                          >
                            {keys.mine}
                          </Typography>
                        </Chip>
                      )}
                      <Typography
                        variant="span"
                        color={input.isMine ? 'muted' : undefined}
                        $maxWidth="400"
                        $textOverflow="ellipsis"
                        $whiteSpace="nowrap"
                        $filter={isDiscreetMode ? 'blur(4px)' : undefined}
                      >
                        {formatTxnAddress(
                          input.address,
                          i,
                          displayTransaction.txn.inputs.length,
                        )}
                      </Typography>
                    </Container>
                  ))}
                </NestedContainer>
              </HistoryItem>
              <HistoryItem leftText={keys.receiver}>
                <NestedContainer>
                  {displayTransaction.txn.outputs.map((output, i) => (
                    <Container
                      direction="row"
                      gap={8}
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${i}-${output.address}`}
                      mb={
                        i !== displayTransaction.txn.outputs.length - 1
                          ? '4px'
                          : '0'
                      }
                    >
                      {output.isMine && (
                        <Chip>
                          <Typography
                            variant="p"
                            $fontSize={14}
                            $fontWeight="medium"
                            color="muted"
                          >
                            {keys.mine}
                          </Typography>
                        </Chip>
                      )}
                      <Typography
                        variant="span"
                        color={output.isMine ? 'muted' : undefined}
                        $maxWidth="400"
                        $textOverflow="ellipsis"
                        $whiteSpace="nowrap"
                        $filter={isDiscreetMode ? 'blur(4px)' : undefined}
                      >
                        {formatTxnAddress(
                          output.address,
                          i,
                          displayTransaction.txn.outputs.length,
                        )}
                      </Typography>
                    </Container>
                  ))}
                </NestedContainer>
              </HistoryItem>
              <HistoryItem leftText={keys.transactionHash}>
                <Container direction="row" gap={8}>
                  <Typography
                    variant="span"
                    $maxWidth="400"
                    $textOverflow="ellipsis"
                    $filter={isDiscreetMode ? 'blur(4px)' : undefined}
                  >
                    {displayTransaction.hash}
                  </Typography>
                  <Clipboard
                    variant="gold"
                    content={displayTransaction.hash}
                    size="sm"
                    onCopy={handleTransactionHashCopy}
                  />
                </Container>
              </HistoryItem>
              {displayTransaction.txn.description && (
                <HistoryItem leftText={keys.description}>
                  <Container direction="row" gap={8}>
                    <Typography
                      variant="span"
                      $maxWidth="400"
                      $textOverflow="ellipsis"
                    >
                      {displayTransaction.txn.description}
                    </Typography>
                  </Container>
                </HistoryItem>
              )}
            </Container>
          </ScrollableContainer>
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
