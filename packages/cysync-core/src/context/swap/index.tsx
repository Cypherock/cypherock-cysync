import { IAccount } from '@cypherock/db-interfaces';
import React, { useEffect, useState } from 'react';
import { useMemoReturn } from '~/hooks';

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

export interface SwapContextInterface {
  currentPage: SwapPage;
  toNextPage: () => void;
  toPreviousPage: () => void;
  reset: () => void;
  fromAccount?: IAccount;
  toAccount?: IAccount;
  quote?: IQuote;
  fillDetails: (params: IFillDetailsParams) => void;
}

export const SwapContext: React.Context<SwapContextInterface> =
  React.createContext<SwapContextInterface>({} as SwapContextInterface);

export interface SwapProviderProps {
  children: React.ReactNode;
}

export const SwapProvider: React.FC<SwapProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(SwapPage.DETAILS);

  const toNextPage = () => {
    setCurrentPage(p => Math.min(SwapPage.STATUS, p + 1));
  };
  const toPreviousPage = () => {
    setCurrentPage(p => Math.max(SwapPage.DETAILS, p - 1));
  };

  const reset = () => {
    setCurrentPage(SwapPage.DETAILS);

    setFromAccount(undefined);
    setToAccount(undefined);
    setQuote(undefined);
  };

  const [fromAccount, setFromAccount] = useState<IAccount | undefined>();
  const [toAccount, setToAccount] = useState<IAccount | undefined>();
  const [quote, setQuote] = useState<IQuote | undefined>();

  const fillDetails = ({ from, to, quote }: IFillDetailsParams) => {
    setFromAccount(from);
    setToAccount(to);
    setQuote(quote);
    console.log({ quotefilled: quote });
  };

  useEffect(() => {
    console.log({ quoteupdated: quote });
  }, [quote]);

  //give details to exchange app (init)
  //start receive flow
  //get details from exchange app (receive signature)
  //give details to server
  //get details from server
  //give details to exchange app (send signature)
  //start send flow
  //get status from server (poll)

  const ctx = useMemoReturn({
    currentPage,
    toNextPage,
    toPreviousPage,
    reset,
    fromAccount,
    toAccount,
    quote,
    fillDetails,
  });
  return <SwapContext.Provider value={ctx}>{children}</SwapContext.Provider>;
};

export function useSwap(): SwapContextInterface {
  return React.useContext(SwapContext);
}
