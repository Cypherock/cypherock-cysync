import { IAccount } from '@cypherock/db-interfaces';
import {
  ExchangeApp,
  IGetSignatureResultResponse,
} from '@cypherock/sdk-app-exchange';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import React, { useCallback, useRef, useState } from 'react';
import { ErrorActionMap, ErrorIconNameMap } from '~/constants/errors';

import { DeviceTask, useDeviceTask, useMemoReturn } from '~/hooks';
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
  closeExchange: () => Promise<void>;
}

export const SwapContext: React.Context<SwapContextInterface> =
  React.createContext<SwapContextInterface>({} as SwapContextInterface);

export interface SwapProviderProps {
  children: React.ReactNode;
}

export const createCustomError = (heading: string, subtext?: string) => ({
  custom: {
    heading,
    subtext,
    details: {
      iconName: ErrorIconNameMap.default,
      action: {
        name: ErrorActionMap.retry,
      },
    },
  },
  isCustomError: true,
});

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

  const getSignatureTask: DeviceTask<
    IGetSignatureResultResponse & { serial: Uint8Array }
  > = async connection => {
    const manager = await ManagerApp.create(connection);
    const deviceInfo = await manager.getDeviceInfo();

    const app = await ExchangeApp.create(connection);

    const data = await app.getSignature();

    return { serial: deviceInfo.deviceSerial, ...data };
  };

  const getSignature = useDeviceTask(getSignatureTask, {
    dontExecuteTask: true,
  });

  const exchangeSignatureRef = useRef<string>();

  const storeSignatureTask: DeviceTask<void> = useCallback(
    async connection => {
      console.log({ ref: exchangeSignatureRef.current });
      if (exchangeSignatureRef.current === undefined)
        throw createCustomError('Invalid signature received from server');

      const app = await ExchangeApp.create(connection);

      await app.storeSignature({
        signature: hexToUint8Array(exchangeSignatureRef.current),
      });
    },
    [exchangeSignatureRef],
  );

  const storeSignature = useDeviceTask(storeSignatureTask, {
    dontExecuteTask: true,
  });

  const initiateExchange = async (address: string) => {
    try {
      const sig = await getSignature.run();

      if (sig.error || sig.result === undefined)
        throw createCustomError('Error while fetching signature from device');

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
        receiverAddressSignature: Buffer.from(sig.result.signature).toString(
          'hex',
        ),
        index: sig.result.index,
        fromNetwork: fromAccount.parentAssetId,
        toNetwork: toAccount.parentAssetId,
        deviceSerial: Buffer.from(sig.result.serial).toString('hex'),
      });

      if (result.status === 200) {
        // get details from server
        setExchangeDetails({
          id: result.data.id,
          address: result.data.exchangeAddress,
          additionalData: result.data.exchangeAddressAdditionalData,
        });

        exchangeSignatureRef.current = result.data.exchangeAddressSignature;

        console.log({ result, ref: exchangeSignatureRef.current });
        const storeSignatureResult = await storeSignature.run();
        if (storeSignatureResult.error) throw storeSignatureResult.error;
      }
    } catch (error) {
      logger.error(error);
      setGlobalError(error);
    }
  };
  // give details to exchange app (send signature)
  // start send flow
  // get status from server (poll)

  // close exchange flow
  const closeExchangeFlowTask: DeviceTask<void> = async connection => {
    const app = await ExchangeApp.create(connection);
    await app.closeFlow();
  };

  const closeExchangeFlow = useDeviceTask(closeExchangeFlowTask, {
    dontExecuteTask: true,
  });

  const closeExchange = async () => {
    const result = await closeExchangeFlow.run();

    if (result.error) {
      setGlobalError(result.error);
    }
  };

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
    closeExchange,
  });
  return <SwapContext.Provider value={ctx}>{children}</SwapContext.Provider>;
};

export function useSwap(): SwapContextInterface {
  return React.useContext(SwapContext);
}
