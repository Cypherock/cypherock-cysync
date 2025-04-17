import { IAccount } from '@cypherock/db-interfaces';
import React, { useCallback, useState } from 'react';

import { useMemoReturn } from '~/hooks';
import { createExchange } from '~/services/swapService';
import logger from '~/utils/logger';

export enum SwapPage {
  DETAILS = 0,
  SUMMARY,
  RECEIVE,
  SEND,
  STATUS,
}

export interface IProviderDetails {
  id: string;
  name: string;
  imageUrl: string;
}

export interface IQuote {
  id: string;
  provider: IProviderDetails;
  validUntil: number;
  fee: string;
  fromAmount: string;
  toAmount: string;
}

export interface IFillDetailsParams {
  from: IAccount;
  to: IAccount;
  quote: IQuote;
}

export interface IExchangeDetails {
  id: string;
  address: string;
  additionalData?: string;
}

export interface SwapContextInterface {
  currentPage: SwapPage;
  toNextPage: () => void;
  toPreviousPage: () => void;
  reset: () => void;
  error: Error;
  retryCurrentPage: () => void;
  fromAccount?: IAccount;
  toAccount?: IAccount;
  quote?: IQuote;
  fillDetails: (params: IFillDetailsParams) => void;
  exchangeDetails?: IExchangeDetails;
  initiateExchange: (address: string) => Promise<void>;
}

export const SwapContext: React.Context<SwapContextInterface> =
  React.createContext<SwapContextInterface>({} as SwapContextInterface);

export interface SwapProviderProps {
  children: React.ReactNode;
}

export const SwapProvider: React.FC<SwapProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(SwapPage.DETAILS);
  const [globalError, setGlobalError] = useState<any>();

  const toNextPage = () => {
    setCurrentPage(p => Math.min(SwapPage.STATUS, p + 1));
  };
  const toPreviousPage = () => {
    setCurrentPage(p => Math.max(SwapPage.DETAILS, p - 1));
  };

  const reset = () => {
    setGlobalError(undefined);

    setCurrentPage(SwapPage.DETAILS);

    setFromAccount(undefined);
    setToAccount(undefined);
    setQuote(undefined);
    setExchangeDetails(undefined);
  };

  const retryMap: Record<SwapPage, () => void> = {
    [SwapPage.DETAILS]: reset,
    [SwapPage.SUMMARY]: reset,
    [SwapPage.RECEIVE]: reset,
    [SwapPage.SEND]: reset,
    [SwapPage.STATUS]: reset,
  };

  const retryPage = useCallback(() => {
    retryMap[currentPage]();
  }, [currentPage]);

  const [fromAccount, setFromAccount] = useState<IAccount | undefined>();
  const [toAccount, setToAccount] = useState<IAccount | undefined>();
  const [quote, setQuote] = useState<IQuote | undefined>();
  const [exchangeDetails, setExchangeDetails] = useState<
    IExchangeDetails | undefined
  >();

  const fillDetails = ({ from, to, quote: newQuote }: IFillDetailsParams) => {
    setFromAccount(from);
    setToAccount(to);
    setQuote(newQuote);
  };

  // give details to exchange app (init)
  // start receive flow
  // get details from exchange app (receive signature)
  const initiateExchange = async (address: string) => {
    try {
      if (
        quote === undefined ||
        toAccount === undefined ||
        fromAccount === undefined
      )
        throw new Error('Invalid prerequisite data');

      // give details to server
      const result = await createExchange({
        id: quote.id,
        providerId: quote.provider.id,
        fromCurrency: fromAccount.assetId,
        toCurrency: toAccount.assetId,
        amount: quote.fromAmount,
        receiverAddress: address,
        receiverAddressSignature: 'sig', // TODO: use actual signature
        fromNetwork: fromAccount.parentAssetId,
        toNetwork: toAccount.parentAssetId,
        deviceSerial: 'ser', // TODO: use actual serial
      });

      if (result.status === 200) {
        // get details from server
        setExchangeDetails({
          id: result.data.id,
          address: result.data.exchangeAddress,
          additionalData: result.data.exchangeAddressAdditionalData,
        });
      }
    } catch (error) {
      logger.error(error);
      setGlobalError(error);
    }
  };
  // give details to exchange app (send signature)
  // start send flow
  // get status from server (poll)

  const ctx = useMemoReturn({
    currentPage,
    toNextPage,
    toPreviousPage,
    reset,
    error: globalError,
    retryCurrentPage: retryPage,
    fromAccount,
    toAccount,
    quote,
    fillDetails,
    exchangeDetails,
    initiateExchange,
  });
  return <SwapContext.Provider value={ctx}>{children}</SwapContext.Provider>;
};

export function useSwap(): SwapContextInterface {
  return React.useContext(SwapContext);
}
