import { IProviderDetails } from '@cypherock/app-support-buy-sell-2';
import {
  Flex,
  Typography,
  Image,
  Tooltip,
  QuestionMarkButton,
  Chip,
} from '@cypherock/cysync-ui';
import React, { useRef } from 'react';

import { useBuySell2 } from '~/context/buySell2';

interface OfferData {
  title: string;
  tooltip: string;
  value: string[];
}

interface OfferDetails {
  isBest: boolean;
  bestOfferText: string;
  isOptimal: boolean;
  optimalOfferText: string;
  data: OfferData[];
}

const OfferBox: React.FC<{
  offer: OfferDetails;
  provider: IProviderDetails;
  onSelect: () => void;
  isSelected: boolean;
}> = ({ offer, onSelect, isSelected, provider }) => (
  <Flex
    p="20"
    px={2}
    gap={16}
    direction="column"
    $borderRadius={isSelected ? 8 : 0}
    $borderColor={isSelected ? 'gold' : 'card'}
    $bgColor={isSelected ? 'input' : 'disabled'}
    $borderWidth={isSelected ? 1 : 0}
    onClick={onSelect}
  >
    <Flex justify="space-between" align="center">
      <Flex gap={8} align="center">
        <Image src={provider.imageUrl} alt="Logo" $width="20" $height="20" />
        <Typography $fontSize={14}>{provider.name}</Typography>
      </Flex>

      {offer.isBest && (
        <Chip
          $gradient="golden"
          $fontSize={10}
          $fontWeight="semibold"
          px="8px"
          py="5px"
        >
          {offer.bestOfferText}
        </Chip>
      )}
      {!offer.isBest && offer.isOptimal && (
        <Chip
          $gradient="golden"
          $fontSize={10}
          $fontWeight="semibold"
          px="8px"
          py="5px"
        >
          {offer.optimalOfferText}
        </Chip>
      )}
    </Flex>

    <Flex direction="column">
      {offer.data.map(data => (
        <Flex justify="space-between" align="center" key={data.title}>
          <Flex gap={8} align="center">
            <Typography $fontSize={14}>{data.title}</Typography>
            <Tooltip text={data.tooltip}>
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

export const Offers = () => {
  const {
    offers,
    selectedOffer,
    setSelectedOffer,
    providers,
    filteredOffers,
    selectedFiatCurrency,
    selectedCrypto,
  } = useBuySell2();

  const cryptoCurrencyCode = useRef(selectedCrypto?.abbr);
  const fiatCurrencyCode = useRef(selectedFiatCurrency?.code);

  const strings = {
    bestOfferText: 'Best Offer',
    optimalOfferText: 'Optimal Offer',
    toAmount: 'You will receive',
    toAmountTooltip: '',
    fees: 'Fees',
    feesTooltip: '',
  };

  return (
    <Flex direction="column" gap={8} $overflow="auto">
      {filteredOffers.map(offer => {
        const provider = providers.find(x => x.id === offer.provider);

        if (!provider) return undefined;

        return (
          <OfferBox
            key={offer.id}
            offer={{
              isBest: offers[0].id === offer.id,
              bestOfferText: strings.bestOfferText,
              isOptimal: filteredOffers[0].id === offer.id,
              optimalOfferText: strings.optimalOfferText,
              data: [
                {
                  title: strings.toAmount,
                  tooltip: strings.toAmountTooltip,
                  value: [
                    `${offer.toAmount} ${cryptoCurrencyCode.current}`,
                    '',
                  ],
                },
                {
                  title: strings.fees,
                  tooltip: strings.feesTooltip,
                  value: [`${offer.fee} ${fiatCurrencyCode.current}`, ''],
                },
              ],
            }}
            provider={provider}
            onSelect={() => setSelectedOffer(offer)}
            isSelected={selectedOffer?.id === offer.id}
          />
        );
      })}
    </Flex>
  );
};
