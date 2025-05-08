import React, { useEffect, useMemo, useState } from 'react';
import {
  Flex,
  Typography,
  Chip,
  Image,
  Button,
  ClockIcon,
  LangDisplay,
  parseLangTemplate,
  Tooltip,
  QuestionMarkButton,
} from '@cypherock/cysync-ui';
import { getDefaultUnit } from '@cypherock/coin-support-utils';
import { formatSecondsToMinutes, BigNumber } from '@cypherock/cysync-utils';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { IQuote, useSwap } from '~/context';
import { useAppSelector, selectLanguage } from '~/store';

export const OfferBox: React.FC<any> = ({
  selectedIndex,
  setSelectedIndex,
  offerData,
}) => (
  <Flex
    p="20px"
    px={2}
    gap={16}
    direction="column"
    $borderRadius={8}
    $borderColor={selectedIndex === offerData.index ? 'gold' : 'card'}
    $borderWidth={1}
    onClick={() => {
      setSelectedIndex(offerData.index);
    }}
  >
    <Flex justify="space-between" align="center">
      <Flex gap={8} align="center">
        <Image
          src={offerData?.provider?.imageUrl ?? ''}
          alt="Logo"
          $width={32}
          $height={32}
        />
        <Typography $fontSize={14}>{offerData.provider.name}</Typography>
      </Flex>
      {offerData.isBest && (
        <Chip
          $gradient="golden"
          $fontSize={10}
          $fontWeight="semibold"
          px="8px"
          py="5px"
        >
          {offerData.bestOfferText}
        </Chip>
      )}
    </Flex>
    <Flex direction="column">
      {offerData?.data?.map((data: any) => (
        <Flex justify="space-between" align="center" key={data.title}>
          <Flex gap={8} align="center">
            <Typography $fontSize={14}>{data.title}</Typography>
            <Tooltip text={data?.tooltip}>
              <QuestionMarkButton />
            </Tooltip>
          </Flex>
          <Flex gap={8} align="center">
            <Typography $fontSize={14}>{data.value[0]}</Typography>
            <Typography $fontSize={12} color="muted">
              {data.value[1]}
            </Typography>
          </Flex>
        </Flex>
      ))}
    </Flex>
  </Flex>
);

export const SwapQuotesHeader: React.FC<{
  size: number;
  onTimeEnd: () => void;
}> = ({ size, onTimeEnd }) => {
  const [seconds, setSeconds] = useState(30);

  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.swap.detailsInput.offers;

  useEffect(() => {
    const interval = setInterval(
      () => setSeconds(s => Math.max(s - 1, 0)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (seconds <= 1) onTimeEnd();
  }, [seconds]);

  const remainingTime = useMemo(
    () => formatSecondsToMinutes(seconds),
    [seconds],
  );

  return (
    <Typography
      color="muted"
      justify="space-between"
      display="flex"
      $allowOverflow
    >
      <span>{parseLangTemplate(displayText.quotesFound, { num: size })}</span>
      <Typography color="muted" align="center" display="flex" gap={8}>
        {parseLangTemplate(displayText.timerText)}
        <Typography
          color="white"
          align="center"
          display="flex"
          gap={8}
          $minWidth="71px"
        >
          <ClockIcon />
          {remainingTime}
        </Typography>
      </Typography>
    </Typography>
  );
};

export const SwapQuotes: React.FC<{
  quotes: IQuote[];
  setSelectedOfferIndex: (val: number) => void;
  selectedOfferIndex?: number;
  toAccount?: IAccount;
  toWallet?: IWallet;
  fromAccount?: IAccount;
  fromWallet?: IWallet;
  findNewQuotes: () => void;
  hasEnoughBalance: boolean;
}> = ({
  quotes,
  setSelectedOfferIndex,
  selectedOfferIndex,
  toAccount,
  toWallet,
  fromWallet,
  fromAccount,
  findNewQuotes,
  hasEnoughBalance,
}) => {
  const { toNextPage, fillDetails } = useSwap();
  const lang = useAppSelector(selectLanguage);
  const displayText = lang.strings.swap.detailsInput.offers;

  return (
    <>
      <SwapQuotesHeader size={quotes.length} onTimeEnd={findNewQuotes} />
      {quotes.map((quote, index) => {
        const fromUnit = getDefaultUnit(
          fromAccount?.parentAssetId ?? '',
          fromAccount?.assetId,
        ).abbr;

        const toUnit = getDefaultUnit(
          toAccount?.parentAssetId ?? '',
          toAccount?.assetId,
        ).abbr;

        const rate = new BigNumber(quote.toAmount)
          .dividedBy(quote.fromAmount)
          .toFixed(6);

        return (
          <OfferBox
            offerData={{
              index,
              data: [
                {
                  title: displayText.fixedRate,
                  tooltip: '',
                  value: [`1 ${fromUnit} =`, `${rate} ${toUnit}`],
                },
              ],
              isBest: index === 0,
              bestOfferText: displayText.bestOffer,
              provider: quote.provider,
            }}
            setSelectedIndex={setSelectedOfferIndex}
            selectedIndex={selectedOfferIndex}
            key={quote.id}
          />
        );
      })}
      {quotes.length === 0 && displayText.errors.noQuotes}
      <Button
        variant="primary"
        disabled={
          selectedOfferIndex === undefined ||
          selectedOfferIndex >= quotes.length ||
          !hasEnoughBalance
        }
        onClick={() => {
          if (
            !fromAccount ||
            !fromWallet ||
            !toAccount ||
            !toWallet ||
            (selectedOfferIndex ?? 0) >= quotes.length
          ) {
            return;
          }
          const quote = quotes[selectedOfferIndex ?? 0];
          fillDetails({
            fromWallet,
            fromAccount,
            toAccount,
            toWallet,
            quote,
          });
          toNextPage();
        }}
        display="inline-block"
      >
        <LangDisplay text={displayText.buttons.continue} />
      </Button>
    </>
  );
};

SwapQuotes.defaultProps = {
  selectedOfferIndex: undefined,
  toAccount: undefined,
  fromAccount: undefined,
  toWallet: undefined,
  fromWallet: undefined,
};
