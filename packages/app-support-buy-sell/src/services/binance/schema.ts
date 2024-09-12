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

export type BinanceGetTradingPairsResponse = z.infer<
  typeof getTradingPairsResultSchema
>;
export type BinanceGetCryptoNetworksResponse = z.infer<
  typeof getCryptoNetworksResultSchema
>;
