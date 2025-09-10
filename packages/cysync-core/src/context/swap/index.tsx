import { IAccount, IWallet, ISwapData } from '@cypherock/db-interfaces';
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
import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';
import { getDB } from '~/utils';
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
  fromWallet: IWallet;
  fromAccount: IAccount;
  fromAmount: string;
  toWallet: IWallet;
  toAccount: IAccount;
  quote: IQuote;
}

export interface IExchangeDetails {
  id: string;
  address: string;
  additionalData?: string;
  validTill: string;
  provider: IProviderDetails;
}

export interface SwapContextInterface {
  currentPage: SwapPage;
  toNextPage: () => void;
  toPreviousPage: () => void;
  reset: () => void;
  error: Error;
  onError: (e?: any) => void;
  retryCurrentPage: () => void;
  fromAccount?: IAccount;
  fromAmount: string;
  fromWallet?: IWallet;
  toAccount?: IAccount;
  toWallet?: IWallet;
  quote?: IQuote;
  receiveFlowValidTill: number;
  setReceiveFlowValidTill: (d: number) => void;
  fillDetails: (params: IFillDetailsParams) => void;
  exchangeDetails?: IExchangeDetails;
  initiateExchange: (address: string) => Promise<void>;
  closeExchange: () => Promise<void>;
  resetIndex: number;
  markTransactionAsSwap: (id: string) => void;
  updateTransactionSwapData: (id: string, swapData: ISwapData) => void;
  transactionId: React.MutableRefObject<string | undefined>;
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
    const newPage = Math.min(SwapPage.STATUS, currentPage + 1);
    setCurrentPage(newPage);

    if (newPage === SwapPage.RECEIVE) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.SWAP_RECEIVE_STEP_STARTED, {
        fromAsset: fromAccount?.assetId,
        toAsset: toAccount?.assetId,
        provider: quote?.provider?.name,
      });
    } else if (newPage === SwapPage.SEND) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.SWAP_SEND_STEP_STARTED, {
        fromAsset: fromAccount?.assetId,
        toAsset: toAccount?.assetId,
        provider: quote?.provider?.name,
      });
    }
  };
  const toPreviousPage = () => {
    setCurrentPage(p => Math.max(SwapPage.DETAILS, p - 1));
  };

  const resetUserInput = () => {
    setFromAccount(undefined);
    setFromWallet(undefined);
    setFromAmount('0');
    setToAccount(undefined);
    setToWallet(undefined);
  };

  const resetState = () => {
    setGlobalError(undefined);
    setCurrentPage(SwapPage.DETAILS);
    setQuote(undefined);
    setExchangeDetails(undefined);
  };

  const resetAll = () => {
    if (fromAccount || toAccount || quote) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.SWAP_CANCELLED, {
        fromAsset: fromAccount?.assetId,
        toAsset: toAccount?.assetId,
        provider: quote?.provider?.name,
        currentPage,
        reason: 'user_reset',
        action: 'dialog_closed',
      });
    }

    resetUserInput();
    resetState();
    setResetIndex(prev => prev + 1);
  };

  const retryMap: Record<SwapPage, () => void> = {
    [SwapPage.DETAILS]: resetState,
    [SwapPage.SUMMARY]: resetState,
    [SwapPage.RECEIVE]: resetState,
    [SwapPage.SEND]: resetState,
    [SwapPage.STATUS]: resetState,
  };

  const [fromWallet, setFromWallet] = useState<IWallet | undefined>();
  const [fromAccount, setFromAccount] = useState<IAccount | undefined>();
  const [fromAmount, setFromAmount] = useState<string>('0');
  const [toWallet, setToWallet] = useState<IWallet | undefined>();
  const [toAccount, setToAccount] = useState<IAccount | undefined>();
  const [quote, setQuote] = useState<IQuote | undefined>();
  const [receiveFlowValidTill, setReceiveFlowValidTill] = useState<number>(0);
  const [resetIndex, setResetIndex] = useState(1);
  const [exchangeDetails, setExchangeDetails] = useState<
    IExchangeDetails | undefined
  >();

  const onError = useCallback(
    (e?: any) => {
      analyticsService.trackEvent(ANALYTICS_EVENTS.SWAP_FAILED, {
        error: e?.message || 'Unknown error',
        step: 'swap_flow_error',
        fromAsset: fromAccount?.assetId,
        toAsset: toAccount?.assetId,
        provider: quote?.provider?.name,
      });
      resetState();
      setGlobalError(e);
    },
    [fromAccount?.assetId, toAccount?.assetId, quote?.provider?.name],
  );

  const retryPage = useCallback(() => {
    analyticsService.trackEvent(ANALYTICS_EVENTS.SWAP_CANCELLED, {
      action: 'retry',
      step: 'swap_flow',
      currentPage,
      fromAsset: fromAccount?.assetId,
      toAsset: toAccount?.assetId,
      provider: quote?.provider?.name,
    });
    retryMap[currentPage]();
  }, [
    currentPage,
    fromAccount?.assetId,
    toAccount?.assetId,
    quote?.provider?.name,
  ]);

  const fillDetails = ({
    fromWallet: sourceWallet,
    fromAccount: sourceAccount,
    fromAmount: sourceAmount,
    toAccount: destinationAccount,
    toWallet: destinationWallet,
    quote: selectedQuote,
  }: IFillDetailsParams) => {
    setFromWallet(sourceWallet);
    setFromAccount(sourceAccount);
    setFromAmount(sourceAmount);
    setToWallet(destinationWallet);
    setToAccount(destinationAccount);
    setQuote(selectedQuote);

    analyticsService.trackEvent(ANALYTICS_EVENTS.SWAP_PROVIDER_SELECTED, {
      providerId: selectedQuote.provider.id,
      providerName: selectedQuote.provider.name,
      fromAsset: sourceAccount.assetId,
      toAsset: destinationAccount.assetId,
      fromAmount: sourceAmount,
      toAmount: selectedQuote.toAmount,
      fee: selectedQuote.fee,
    });
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
          validTill: result.data.validTill,
          provider: quote.provider,
        });

        exchangeSignatureRef.current = result.data.exchangeAddressSignature;

        console.log({ result, ref: exchangeSignatureRef.current });
        const storeSignatureResult = await storeSignature.run();
        if (storeSignatureResult.error) throw storeSignatureResult.error;
      }
    } catch (error) {
      logger.error(error);

      analyticsService.trackEvent(ANALYTICS_EVENTS.SWAP_FAILED, {
        error: error instanceof Error ? error.message : 'Unknown error',
        fromAsset: fromAccount?.assetId,
        toAsset: toAccount?.assetId,
        provider: quote?.provider?.name,
        step: 'initiate_exchange',
      });

      onError(error);
      await closeExchange();
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
    let error: Error | undefined;
    let retries = 3;
    do {
      const result = await closeExchangeFlow.run();
      error = result.error;

      if (error) {
        logger.error(error);
      }
      retries -= 1;
    } while (error && retries > 0);

    logger.info('Swap closed');
  };

  const markTransactionAsSwap = (id: string) => {
    const db = getDB();
    db.transaction.update({ __id: id }, { isSwap: true });

    analyticsService.trackEvent(ANALYTICS_EVENTS.SWAP_SUCCEEDED, {
      fromAsset: fromAccount?.assetId,
      toAsset: toAccount?.assetId,
      provider: quote?.provider?.name,
    });
  };

  const updateTransactionSwapData = (id: string, swapData: ISwapData) => {
    const db = getDB();
    db.transaction.update({ __id: id }, { swapData });
  };

  const transactionId = useRef<string>();

  const ctx = useMemoReturn({
    currentPage,
    toNextPage,
    toPreviousPage,
    reset: resetAll,
    error: globalError,
    onError,
    retryCurrentPage: retryPage,
    fromWallet,
    fromAccount,
    fromAmount,
    toWallet,
    toAccount,
    quote,
    receiveFlowValidTill,
    setReceiveFlowValidTill,
    fillDetails,
    exchangeDetails,
    initiateExchange,
    closeExchange,
    markTransactionAsSwap,
    updateTransactionSwapData,
    transactionId,
    resetIndex,
  });
  return <SwapContext.Provider value={ctx}>{children}</SwapContext.Provider>;
};

export function useSwap(): SwapContextInterface {
  return React.useContext(SwapContext);
}
