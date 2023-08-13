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

export const HistoryDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const keys = lang.strings.history.info.dialogBox;
  const dialogs = useAppSelector(selectDialogs);
  const row = dialogs.historyDialog.data as Row;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const onClose = () => {
    dispatch(closeDialog('historyDialog'));
  };
  const IconComponent = row.icon;

  return (
    <BlurOverlay>
      <DialogBox width={700} pb={3}>
        <DialogBoxHeader height={56} width={700}>
          <Flex width="full" justify="flex-end">
            <CloseButton onClick={onClose} />
          </Flex>
        </DialogBoxHeader>
        <DialogBoxBody align="center" direction="column" height="full">
          <IconComponent fill={row.fill} width="56px" height="48px" />
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
              <Typography variant="h5">{`${row.amount} ${row.symbol}`}</Typography>
              <Typography variant="span" color="muted">
                {row.timeStamp}
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
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.value}
                </Typography>
              }
              rightComponent={
                <Typography variant="span">${row.value}</Typography>
              }
            />
            <Divider variant="horizontal" />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted" align="center">
                  {keys.fee}
                </Typography>
              }
              rightComponent={
                <NestedContainer>
                  <Typography variant="span">{`${row.feeEth} ${row.symbol}`}</Typography>
                  <Typography variant="span" $fontSize={14} color="normal">
                    = {row.feeDollar}
                  </Typography>
                </NestedContainer>
              }
            />
            <Divider variant="horizontal" />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.type}
                </Typography>
              }
              rightComponent={
                <Container direction="row" gap={8}>
                  <IconComponent
                    width="15px"
                    height="12px"
                    fill={theme.palette.text.white}
                  />
                  <Typography variant="span">{row.type}</Typography>
                </Container>
              }
            />
            <Divider variant="horizontal" />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.status}
                </Typography>
              }
              rightComponent={
                <Typography variant="span" color={textColorMap[row.status]}>
                  {row.status}
                </Typography>
              }
            />
            <Divider variant="horizontal" />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.wallet}
                </Typography>
              }
              rightComponent={
                <Typography variant="span">{row.wallet}</Typography>
              }
            />
            <Divider variant="horizontal" />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.account}
                </Typography>
              }
              rightComponent={
                <Container direction="row" gap={8}>
                  <Image
                    src={imageSrcMap[row.account]}
                    alt="ethereum icon"
                    width="16px"
                    height="24px"
                  />
                  <Typography variant="span">{row.account}</Typography>
                </Container>
              }
            />
            <Divider variant="horizontal" />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.asset}
                </Typography>
              }
              rightComponent={
                <Container direction="row" gap={8}>
                  <Image
                    src={imageSrcMap[row.asset]}
                    alt="ethereum icon"
                    width="16px"
                    height="24px"
                  />
                  <Typography variant="span">{row.asset}</Typography>
                </Container>
              }
            />
            <Divider variant="horizontal" />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.sender}
                </Typography>
              }
              rightComponent={
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
                    {row.hash}
                  </Typography>
                </Container>
              }
            />
            <Divider variant="horizontal" />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.receiver}
                </Typography>
              }
              rightComponent={
                <NestedContainer>
                  <Typography variant="span">1. {row.hash}</Typography>
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
                      2. {row.hash}
                    </Typography>
                  </Container>
                </NestedContainer>
              }
            />
            <SummaryContainer
              leftComponent={
                <Typography variant="span" color="muted">
                  {keys.transactionHash}
                </Typography>
              }
              rightComponent={
                <Container direction="row" gap={8}>
                  <Typography variant="span">{row.hash}</Typography>
                  <Clipboard variant="gold" content={row.hash} size="sm" />
                </Container>
              }
            />
            <Divider variant="horizontal" />
          </Container>
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
