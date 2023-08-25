import {
  DialogBox,
  DialogBoxBody,
  Image,
  Flex,
  Clipboard,
  Chip,
  BlurOverlay,
  CloseButton,
  DialogBoxHeader,
  Container,
  imageSrcMap,
  useTheme,
  Typography,
  GoldExternalLink,
  SummaryContainer,
  Divider,
  NestedContainer,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import {
  closeDialog,
  selectDialogs,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { Row } from './HistoryTable';

const textColorMap: any = {
  Success: 'success',
  Failed: 'error',
  Pending: 'warn',
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

export const HistoryDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const keys = lang.strings.history.info.dialogBox;
  const dialogs = useAppSelector(selectDialogs);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const {
    icon: IconComponent,
    fill,
    amount,
    symbol,
    timeStamp,
    value,
    feeEth,
    feeDollar,
    type,
    status,
    wallet,
    account,
    asset,
    hash,
  } = dialogs.historyDialog.data as Row;

  const onClose = () => dispatch(closeDialog('historyDialog'));

  return (
    <BlurOverlay>
      <DialogBox width={700} pb={3}>
        <DialogBoxHeader height={56} width={700}>
          <Flex width="full" justify="flex-end">
            <CloseButton onClick={onClose} />
          </Flex>
        </DialogBoxHeader>
        <DialogBoxBody align="center" direction="column" height="full">
          <IconComponent fill={fill} width="56px" height="48px" />
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
              <Typography variant="h5">{`${amount} ${symbol}`}</Typography>
              <Typography variant="span" color="muted">
                {timeStamp}
              </Typography>
            </Container>
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
          </Container>
          <Container
            display="flex"
            direction="column"
            width="full"
            pt={5}
            gap={12}
          >
            <HistoryItem leftText={keys.value}>
              <Typography variant="span">${value}</Typography>
            </HistoryItem>
            <HistoryItem leftText={keys.fee}>
              <NestedContainer>
                <Typography variant="span">{`${feeEth} ${symbol}`}</Typography>
                <Typography variant="span" $fontSize={14} color="normal">
                  = {feeDollar}
                </Typography>
              </NestedContainer>
            </HistoryItem>
            <HistoryItem leftText={keys.type}>
              <Container direction="row" gap={8}>
                <IconComponent
                  width="15px"
                  height="12px"
                  fill={theme.palette.text.white}
                />
                <Typography variant="span">{type}</Typography>
              </Container>
            </HistoryItem>
            <HistoryItem leftText={keys.status}>
              <Typography variant="span" color={textColorMap[status]}>
                {status}
              </Typography>
            </HistoryItem>
            <HistoryItem leftText={keys.wallet}>
              <Typography variant="span">{wallet}</Typography>
            </HistoryItem>
            <HistoryItem leftText={keys.account}>
              <Container direction="row" gap={8}>
                <Image
                  src={imageSrcMap[account]}
                  alt="ethereum icon"
                  width="16px"
                  height="24px"
                />
                <Typography variant="span">{account}</Typography>
              </Container>
            </HistoryItem>
            <HistoryItem leftText={keys.asset}>
              <Container direction="row" gap={8}>
                <Image
                  src={imageSrcMap[asset]}
                  alt="ethereum icon"
                  width="16px"
                  height="24px"
                />
                <Typography variant="span">{asset}</Typography>
              </Container>
            </HistoryItem>
            <HistoryItem leftText={keys.sender}>
              <Container direction="row" gap={8}>
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
                <Typography variant="span" color="muted">
                  {hash}
                </Typography>
              </Container>
            </HistoryItem>
            <HistoryItem leftText={keys.receiver}>
              <NestedContainer>
                <Typography variant="span">1. {hash}</Typography>
                <Container direction="row" gap={8}>
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
                  <Typography variant="span" color="muted">
                    2. {hash}
                  </Typography>
                </Container>
              </NestedContainer>
            </HistoryItem>
            <HistoryItem leftText={keys.transactionHash}>
              <Container direction="row" gap={8}>
                <Typography variant="span">{hash}</Typography>
                <Clipboard variant="gold" content={hash} size="sm" />
              </Container>
            </HistoryItem>
          </Container>
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
