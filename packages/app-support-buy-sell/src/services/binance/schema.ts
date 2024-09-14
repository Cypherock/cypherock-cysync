import { z } from 'zod';

const commonResultSchema = z.object({
  success: z.boolean().nullish(),
  code: z.string().nullish(),
  message: z.string().nullish(),
});

export const getTradingPairsResultSchema = commonResultSchema.extend({
  data: z.object({
    fiatCurrencies: z.array(z.string()),
    cryptoCurrencies: z.array(z.string()),
  }),
});

export const getCryptoNetworksResultSchema = commonResultSchema.extend({
  data: z.array(
    z.object({
      cryptoCurrency: z.string(),
      networks: z.array(
        z.object({
          network: z.string(),
          addressRegex: z.string().nullish(),
          memoRegex: z.string().nullish(),
          withdrawFee: z.union([z.string(), z.number()]).nullish(),
          withdrawMinAmount: z.union([z.string(), z.number()]).nullish(),
          withdrawMaxAmount: z.union([z.string(), z.number()]).nullish(),
          contractAddress: z.string().nullish(),
        }),
      ),
    }),
  ),
});

export interface IBinanceGetEstimatedQuoteParams {
  fiatCurrency: string;
  cryptoCurrency: string;
  requestedAmount: string;
  amountType: number;
  payMethodCode?: string;
  payMethodSubCode?: string;
  network?: string;
}

export const getEstimatedQuoteResultSchema = commonResultSchema.extend({
  data: z.object({
    totalAmount: z.string().nullish(),
    quotePrice: z.string().nullish(),
    feeAmount: z.string().nullish(),
    feeCurrency: z.string().nullish(),
    networkFee: z.string().nullish(),
  }),
});

export interface IBinanceGetPaymentMethodListParams {
  fiatCurrency: string;
  cryptoCurrency: string;
  totalAmount?: string;
  amountType: number;
  language?: string;
}

export const getPaymentMethodListResultSchema = commonResultSchema.extend({
  data: z.object({
    paymentMethods: z.array(
      z.object({
        payMethodCode: z.string(),
        payMethodSubCode: z.string().nullish(),
        paymentMethod: z.string(),
        fiatMinLimit: z.string().nullish(),
        fiatMaxLimit: z.string().nullish(),
        cryptoMinLimit: z.string().nullish(),
        cryptoMaxLimit: z.string().nullish(),
        p2p: z.boolean().nullish(),
        withdrawRestriction: z.number().nullish(),
      }),
    ),
  }),
});

export interface IBinancePreorderParams {
  fiatCurrency: string;
  fiatAmount: string;
  cryptoCurrency: string;
  payMethodCode: string;
  payMethodSubCode: string;
  network: string;
  address: string;
}

export const preorderResultSchema = commonResultSchema.extend({
  data: z.object({
    orderId: z.string(),
    link: z.string(),
    linkExpireTime: z.number().nullish(),
  }),
});

export interface IBinanceGetOrderDetailsParams {
  orderId: string;
  language?: string;
}

export const getOrderDetailsResultSchema = commonResultSchema.extend({
  data: z.object({
    type: z.number(),
    status: z.number(),
    fiatCurrency: z.string(),
    cryptoCurrency: z.string(),
    fiatAmount: z.string(),
    cryptoAmount: z.string(),
    paymentMethod: z.object({
      payMethodCode: z.string(),
      payMethodSubCode: z.string().nullish(),
      paymentMethod: z.string(),
      fiatMinLimit: z.string().nullish(),
      fiatMaxLimit: z.string().nullish(),
      cryptoMinLimit: z.string().nullish(),
      cryptoMaxLimit: z.string().nullish(),
      p2p: z.boolean().nullish(),
      withdrawRestriction: z.number().nullish(),
    }),
    feeAmount: z.string().nullish(),
    feeCurrency: z.string().nullish(),
    networkFee: z.string().nullish(),
    withdrawWalletAddress: z.string().nullish(),
    withdrawNetwork: z.string().nullish(),
    withdrawTxHash: z.string().nullish(),
    orderTime: z.number(),
    completionTime: z.number().nullish(),
  }),
});

export type BinanceGetTradingPairsResponse = z.infer<
  typeof getTradingPairsResultSchema
>;
export type BinanceGetCryptoNetworksResponse = z.infer<
  typeof getCryptoNetworksResultSchema
>;
export type BinanceGetEstimatedQuoteResponse = z.infer<
  typeof getEstimatedQuoteResultSchema
>;
export type BinanceGetPaymentMethodListResponse = z.infer<
  typeof getPaymentMethodListResultSchema
>;
export type BinancePreorderResponse = z.infer<typeof preorderResultSchema>;
export type BinanceGetOrderDetailsResponse = z.infer<
  typeof getOrderDetailsResultSchema
>;
