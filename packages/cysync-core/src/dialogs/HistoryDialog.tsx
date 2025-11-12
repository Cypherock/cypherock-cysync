import { coinFamiliesMap } from '@cypherock/coins';
import { formatAddress } from '@cypherock/cysync-core-services';
import {
  BlurOverlay,
  Button,
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
  TypographyColor,
  useTheme,
} from '@cypherock/cysync-ui';
import {
  ITransaction,
  TransactionStatus,
  TransactionStatusMap,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import React, { FC, useMemo } from 'react';

import { openTransactionActionDialog } from '~/actions';
import { useCurrency } from '~/context';
import { mapTransactionForDisplay } from '~/hooks';
import {
  closeDialog,
  openSnackBar,
  selectCurrentCurrencyPriceInfos,
  selectDiscreetMode,
  selectLanguage,
  selectTransactionById,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { TransactionActionType } from './Canton/TransactionAction/context';

import { LoaderDialog } from '../components';

export interface IHistoryDialogProps {
  txn: ITransaction;
}

const textColorMap: Record<TransactionStatus, TypographyColor> = {
  [TransactionStatusMap.success]: 'success',
  [TransactionStatusMap.failed]: 'error',
  [TransactionStatusMap.pending]: 'warn',
  [TransactionStatusMap.expired]: 'error',
  [TransactionStatusMap.cancelled]: 'error',
  [TransactionStatusMap.rejected]: 'error',
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
    [TransactionStatusMap.expired]: theme.palette.text.error,
    [TransactionStatusMap.cancelled]: theme.palette.text.error,
    [TransactionStatusMap.rejected]: theme.palette.text.error,
  };

  return map[status];
};

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectUnHiddenAccounts,
    selectCurrentCurrencyPriceInfos,
    selectDiscreetMode,
    (state, currency: string) => currency,
  ],
  (
    lang,
    { wallets },
    { accounts },
    priceInfos,
    { active: isDiscreetMode },
    currency,
  ) => ({
    lang,
    wallets,
    accounts,
    priceInfos,
    isDiscreetMode,
    currency,
  }),
);

const getTransactionHashText = (familyId: string, keys: any): string => {
  if (familyId === coinFamiliesMap.icp) {
    return keys.transactionId;
  }
  if (familyId === coinFamiliesMap.canton) {
    return keys.transactionUpdateId;
  }
  return keys.transactionHash;
};

interface TransactionActionButtonsProps {
  transactionType: string;
  onClose: () => void;
  onOpenActionDialog: (actionType: TransactionActionType) => void;
  lang: any;
}

const TransactionActionButtons: FC<TransactionActionButtonsProps> = ({
  transactionType,
  onClose,
  onOpenActionDialog,
  lang,
}) => {
  const handleAction = (actionType: TransactionActionType) => {
    onClose();
    onOpenActionDialog(actionType);
  };

  if (transactionType === TransactionTypeMap.send) {
    return (
      <Container
        $borderWidthT={1}
        $borderColor="separator"
        $borderStyle="solid"
        px={5}
        py={2}
        gap={16}
      >
        <Button
          onClick={() => handleAction(TransactionActionType.CANCEL)}
          variant="secondary"
          disabled
        >
          {lang.strings.buttons.cancel}
        </Button>
      </Container>
    );
  }

  if (transactionType === TransactionTypeMap.receive) {
    return (
      <Container
        $borderWidthT={1}
        $borderColor="separator"
        $borderStyle="solid"
        px={5}
        py={2}
        gap={16}
      >
        <Button
          onClick={() => handleAction(TransactionActionType.REJECT)}
          variant="secondary"
          disabled
        >
          {lang.strings.buttons.reject}
        </Button>
        <Button
          onClick={() => handleAction(TransactionActionType.APPROVE)}
          disabled
        >
          {lang.strings.buttons.accept}
        </Button>
      </Container>
    );
  }

  return null;
};

interface ConditionalHistoryItemProps {
  condition: boolean;
  leftText: string;
  children: React.ReactNode;
}

const ConditionalHistoryItem: FC<ConditionalHistoryItemProps> = ({
  condition,
  leftText,
  children,
}) => {
  if (!condition) return null;

  return (
    <HistoryItem leftText={leftText}>
      <Container direction="row" gap={8}>
        <Typography variant="span" $maxWidth="400" $textOverflow="ellipsis">
          {children}
        </Typography>
      </Container>
    </HistoryItem>
  );
};

export const HistoryDialog: FC<IHistoryDialogProps> = ({ txn: _txn }) => {
  const { currentCurrency } = useCurrency();
  const { lang, wallets, accounts, priceInfos, isDiscreetMode, currency } =
    useAppSelector(state => selector(state, currentCurrency));
  const keys = lang.strings.history.dialogBox;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const txn = useAppSelector(selectTransactionById(_txn.__id));

  const displayTransaction = useMemo(() => {
    if (txn === undefined) return undefined;
    return mapTransactionForDisplay({
      transaction: txn,
      isDiscreetMode,
      priceInfos,
      wallets,
      accounts,
      lang,
      currency,
    });
  }, [
    txn,
    wallets,
    accounts,
    lang,
    priceInfos,
    isDiscreetMode,
    currentCurrency,
  ]);

  const onClose = () => dispatch(closeDialog('historyDialog'));

  const handleTransactionHashCopy = () => {
    dispatch(
      openSnackBar({
        icon: 'check',
        text: lang.strings.snackbar.copiedToClipboard,
      }),
    );
  };

  const getFeePrefix = () => {
    if (txn === undefined) return '';
    return (keys.feePrefix as any)[txn.assetId] ?? '';
  };

  const formatTxnAddress = (address: string, index: number, total: number) => {
    if (txn === undefined) return '';

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

  if (displayTransaction === undefined) {
    return <LoaderDialog />;
  }

  const isCantonTransaction =
    displayTransaction.txn.familyId === coinFamiliesMap.canton;

  const transactionHashText = getTransactionHashText(
    displayTransaction.txn.familyId,
    keys,
  );

  const showTransactionAction =
    isCantonTransaction &&
    displayTransaction.status === TransactionStatusMap.pending;

  const handleOpenActionDialog = (actionType: TransactionActionType) => {
    dispatch(
      openTransactionActionDialog({
        transactionActionType: actionType,
        selectedTransaction: displayTransaction.txn,
      }),
    );
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
            {showTransactionAction && (
              <TransactionActionButtons
                transactionType={displayTransaction.txn.type}
                onClose={onClose}
                onOpenActionDialog={handleOpenActionDialog}
                lang={lang}
              />
            )}

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
              <ConditionalHistoryItem
                condition={displayTransaction.destinationTag !== undefined}
                leftText={keys.destinationTag}
              >
                {displayTransaction.destinationTag}
              </ConditionalHistoryItem>
              <ConditionalHistoryItem
                condition={!!displayTransaction.choice}
                leftText={keys.choice}
              >
                {displayTransaction.choice}
              </ConditionalHistoryItem>
              <ConditionalHistoryItem
                condition={displayTransaction.memo !== undefined}
                leftText={keys.memo}
              >
                {displayTransaction.memo}
              </ConditionalHistoryItem>
              <ConditionalHistoryItem
                condition={displayTransaction.startDate !== undefined}
                leftText={keys.startDate}
              >
                {displayTransaction.startDate}
              </ConditionalHistoryItem>
              <ConditionalHistoryItem
                condition={displayTransaction.expiryDate !== undefined}
                leftText={keys.expirationDate}
              >
                {displayTransaction.expiryDate}
              </ConditionalHistoryItem>
              <ConditionalHistoryItem
                condition={displayTransaction.operation !== undefined}
                leftText={keys.operation}
              >
                {displayTransaction.operation}
              </ConditionalHistoryItem>
              <HistoryItem leftText={transactionHashText}>
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
              {displayTransaction.remarks.length > 0 && (
                <HistoryItem leftText={keys.remarks} key={keys.receiver}>
                  <Container
                    display="flex"
                    direction="column"
                    justify="flex-end"
                    align="flex-end"
                    width="440"
                    gap={8}
                  >
                    {displayTransaction.remarks.map((remark, index) => (
                      <Typography
                        $textAlign="right"
                        variant="span"
                        width="full"
                        color="muted"
                        $wordBreak="break-word"
                        key={`${remark + index}`}
                      >
                        {remark}
                      </Typography>
                    ))}
                  </Container>
                </HistoryItem>
              )}
              <ConditionalHistoryItem
                condition={!!displayTransaction.txn.description}
                leftText={keys.description}
              >
                {displayTransaction.txn.description}
              </ConditionalHistoryItem>
            </Container>
          </ScrollableContainer>
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
