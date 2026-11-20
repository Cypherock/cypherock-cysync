import { erc20TokenAutomationParams } from '../../../../src/commands/erc20/params';
import { IValidTokenDiffTestCase } from './types';

const existingTokenList = [
  {
    description: {
      en: 'Tether (USDT) is a cryptocurrency with a value meant to mirror the value of the U.S. dollar. The idea was to create a stable cryptocurrency that can be used like digital dollars. Coins that serve this purpose of being a stable dollar substitute are called “stable coins.” Tether is the most popular stable coin and even acts as a dollar replacement on many popular exchanges! According to their site, Tether converts cash into digital currency, to anchor or “tether” the value of the coin to the price of national currencies like the US dollar, the Euro, and the Yen. Like other cryptos it uses blockchain. Unlike other cryptos, it is [according to the official Tether site] “100% backed by USD” (USD is held in reserve). The primary use of Tether is that it offers some stability to the otherwise volatile crypto space and offers liquidity to exchanges who can’t deal in dollars and with banks (for example to the sometimes controversial but leading exchange <a href="https://www.coingecko.com/en/exchanges/bitfinex">Bitfinex</a>).\r\n\r\nThe digital coins are issued by a company called Tether Limited that is governed by the laws of the British Virgin Islands, according to the legal part of its website. It is incorporated in Hong Kong. It has emerged that Jan Ludovicus van der Velde is the CEO of cryptocurrency exchange Bitfinex, which has been accused of being involved in the price manipulation of bitcoin, as well as tether. Many people trading on exchanges, including Bitfinex, will use tether to buy other cryptocurrencies like bitcoin. Tether Limited argues that using this method to buy virtual currencies allows users to move fiat in and out of an exchange more quickly and cheaply. Also, exchanges typically have rocky relationships with banks, and using Tether is a way to circumvent that.\r\n\r\nUSDT is fairly simple to use. Once on exchanges like <a href="https://www.coingecko.com/en/exchanges/poloniex">Poloniex</a> or Bittrex, it can be used to purchase Bitcoin and other cryptocurrencies. It can be easily transferred from an exchange to any Omni Layer enabled wallet. Tether has no transaction fees, although external wallets and exchanges may charge one. In order to convert USDT to USD and vise versa through the Tether.to Platform, users must pay a small fee. Buying and selling Tether for Bitcoin can be done through a variety of exchanges like the ones mentioned previously or through the Tether.to platform, which also allows the conversion between USD to and from your bank account.',
    },
    id: 'tether',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661',
      small:
        'https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661',
      thumb:
        'https://assets.coingecko.com/coins/images/325/thumb/Tether.png?1696501661',
    },
    last_updated_at: '2024-03-27T09:16:23.403Z',
    market_cap: 104520177812,
    name: 'Tether',
    platforms: {
      avalanche: {
        contract_address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
        decimal_place: 6,
      },
    },
    symbol: 'usdt',
  },
  {
    description: {
      en: 'Tether (USDT) is a cryptocurrency with a value meant to mirror the value of the U.S. dollar. The idea was to create a stable cryptocurrency that can be used like digital dollars. Coins that serve this purpose of being a stable dollar substitute are called “stable coins.” Tether is the most popular stable coin and even acts as a dollar replacement on many popular exchanges! According to their site, Tether converts cash into digital currency, to anchor or “tether” the value of the coin to the price of national currencies like the US dollar, the Euro, and the Yen. Like other cryptos it uses blockchain. Unlike other cryptos, it is [according to the official Tether site] “100% backed by USD” (USD is held in reserve). The primary use of Tether is that it offers some stability to the otherwise volatile crypto space and offers liquidity to exchanges who can’t deal in dollars and with banks (for example to the sometimes controversial but leading exchange <a href="https://www.coingecko.com/en/exchanges/bitfinex">Bitfinex</a>).\r\n\r\nThe digital coins are issued by a company called Tether Limited that is governed by the laws of the British Virgin Islands, according to the legal part of its website. It is incorporated in Hong Kong. It has emerged that Jan Ludovicus van der Velde is the CEO of cryptocurrency exchange Bitfinex, which has been accused of being involved in the price manipulation of bitcoin, as well as tether. Many people trading on exchanges, including Bitfinex, will use tether to buy other cryptocurrencies like bitcoin. Tether Limited argues that using this method to buy virtual currencies allows users to move fiat in and out of an exchange more quickly and cheaply. Also, exchanges typically have rocky relationships with banks, and using Tether is a way to circumvent that.\r\n\r\nUSDT is fairly simple to use. Once on exchanges like <a href="https://www.coingecko.com/en/exchanges/poloniex">Poloniex</a> or Bittrex, it can be used to purchase Bitcoin and other cryptocurrencies. It can be easily transferred from an exchange to any Omni Layer enabled wallet. Tether has no transaction fees, although external wallets and exchanges may charge one. In order to convert USDT to USD and vise versa through the Tether.to Platform, users must pay a small fee. Buying and selling Tether for Bitcoin can be done through a variety of exchanges like the ones mentioned previously or through the Tether.to platform, which also allows the conversion between USD to and from your bank account.',
    },
    id: 'tether',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/325/large/Tether.png?1696501661',
      small:
        'https://assets.coingecko.com/coins/images/325/small/Tether.png?1696501661',
      thumb:
        'https://assets.coingecko.com/coins/images/325/thumb/Tether.png?1696501661',
    },
    last_updated_at: '2024-03-27T09:16:23.403Z',
    market_cap: 104520177812,
    name: 'Tether',
    platforms: {
      ethereum: {
        contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        decimal_place: 6,
      },
    },
    symbol: 'usdt',
  },
  {
    description: {
      en: 'Binance Coin is the cryptocurrency of the <a href="https://www.coingecko.com/en/exchanges/binance">Binance</a> platform. It is a trading platform exclusively for cryptocurrencies. The name "Binance" is a combination of binary and finance.\r\n\r\nThus, the startup name shows that only cryptocurrencies can be traded against each other. It is not possible to trade crypto currencies against Fiat. The platform achieved an enormous success within a very short time and is focused on worldwide market with Malta headquarters. The cryptocurrency currently has a daily trading volume of 1.5 billion - 2 billion US dollars and is still increasing.\r\n\r\nIn total, there will only be 200 million BNBs. Binance uses the <a href="https://www.coingecko.com/en/coins/all?asset_platform_id=279">ERC20 token standard</a> from <a href="https://www.coingecko.com/en/coins/ethereum">Ethereum</a> and has distributed it as follow: 50% sold on ICO, 40% to the team and 10% to Angel investors. The coin can be used to pay fees on Binance. These include trading fees, transaction fees, listing fees and others. Binance gives you a huge discount when fees are paid in BNB. \r\n\r\nThe schedule of BNB fees discount is as follow: In the first year, 50% discount on all fees, second year 25% discount, third year 12.5% discount, fourth year 6.75 % discount, and from the fifth year onwards there is no discount. This structure is used to incentivize users to buy BNB and do trades within Binance.\r\n\r\nBinance announced in a buyback plan that it would buy back up to 100 million BNB in Q1 2018. The coins are then burned. This means that they are devaluated to increase the value of the remaining coins. This benefits investors. In the future, the cryptocurrency will remain an asset on the trading platform and will be used as gas.\r\n\r\nOther tokens that are issued by exchanges include <a href="https://www.coingecko.com/en/coins/bibox-token">Bibox Token</a>, <a href="https://www.coingecko.com/en/coins/okb">OKB</a>, <a href="https://www.coingecko.com/en/coins/huobi-token">Huobi Token</a>, and more.',
    },
    id: 'binancecoin',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970',
      small:
        'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png?1696501970',
      thumb:
        'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png?1696501970',
    },
    last_updated_at: '2024-03-27T09:00:22.529Z',
    market_cap: 88158294584,
    name: 'BNB',
    platforms: {
      ethereum: {
        contract_address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
        decimal_place: 18,
      },
    },
    symbol: 'bnb',
  },
  {
    description: {
      en: 'Lido Staked Ether (stETH) is a token that represents your staked ether in Lido, combining the value of initial deposit and staking rewards. stETH tokens are minted upon deposit and burned when redeemed. stETH token balances are pegged 1:1 to the ethers that are staked by Lido and the token’s balances are updated daily to reflect earnings and rewards. stETH tokens can be used as one would use ether, allowing you to earn ETH 2.0 staking rewards whilst benefiting from e.g. yields across decentralised finance products.',
    },
    id: 'staked-ether',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png?1696513206',
      small:
        'https://assets.coingecko.com/coins/images/13442/small/steth_logo.png?1696513206',
      thumb:
        'https://assets.coingecko.com/coins/images/13442/thumb/steth_logo.png?1696513206',
    },
    last_updated_at: '2024-03-27T09:16:21.219Z',
    market_cap: 34459619174,
    name: 'Lido Staked Ether',
    platforms: {
      ethereum: {
        contract_address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        decimal_place: 18,
      },
    },
    symbol: 'steth',
  },
  {
    description: {
      en: 'USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on cryptocurrency exchanges. The technology behind CENTRE makes it possible to exchange value between people, businesses and financial institutions just like email between mail services and texts between SMS providers. We believe by removing artificial economic borders, we can create a more inclusive global economy.',
    },
    id: 'usd-coin',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      small:
        'https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506694',
      thumb:
        'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694',
    },
    last_updated_at: '2024-03-27T09:17:33.297Z',
    market_cap: 32336468430,
    name: 'USDC',
    platforms: {
      arbitrum: {
        contract_address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        decimal_place: 6,
      },
    },
    symbol: 'usdc',
    version: 'e9605674',
  },
  {
    description: {
      en: 'USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on cryptocurrency exchanges. The technology behind CENTRE makes it possible to exchange value between people, businesses and financial institutions just like email between mail services and texts between SMS providers. We believe by removing artificial economic borders, we can create a more inclusive global economy.',
    },
    id: 'usd-coin',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      small:
        'https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506694',
      thumb:
        'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694',
    },
    last_updated_at: '2024-03-27T09:17:33.297Z',
    market_cap: 32336468430,
    name: 'USDC',
    platforms: {
      avalanche: {
        contract_address: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
        decimal_place: 6,
      },
    },
    symbol: 'usdc',
  },
  {
    description: {
      en: 'USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on cryptocurrency exchanges. The technology behind CENTRE makes it possible to exchange value between people, businesses and financial institutions just like email between mail services and texts between SMS providers. We believe by removing artificial economic borders, we can create a more inclusive global economy.',
    },
    id: 'usd-coin',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      small:
        'https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506694',
      thumb:
        'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694',
    },
    last_updated_at: '2024-03-27T09:17:33.297Z',
    market_cap: 32336468430,
    name: 'USDC',
    platforms: {
      ethereum: {
        contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimal_place: 6,
      },
    },
    symbol: 'usdc',
  },
  {
    description: {
      en: 'USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on cryptocurrency exchanges. The technology behind CENTRE makes it possible to exchange value between people, businesses and financial institutions just like email between mail services and texts between SMS providers. We believe by removing artificial economic borders, we can create a more inclusive global economy.',
    },
    id: 'usd-coin',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      small:
        'https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506694',
      thumb:
        'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694',
    },
    last_updated_at: '2024-03-27T09:17:33.297Z',
    market_cap: 32336468430,
    name: 'USDC',
    platforms: {
      optimism: {
        contract_address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
        decimal_place: 6,
      },
    },
    symbol: 'usdc',
    version: 'eeb4086e',
  },
  {
    description: {
      en: 'USDC is a fully collateralized US dollar stablecoin. USDC is the bridge between dollars and trading on cryptocurrency exchanges. The technology behind CENTRE makes it possible to exchange value between people, businesses and financial institutions just like email between mail services and texts between SMS providers. We believe by removing artificial economic borders, we can create a more inclusive global economy.',
    },
    id: 'usd-coin',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
      small:
        'https://assets.coingecko.com/coins/images/6319/small/usdc.png?1696506694',
      thumb:
        'https://assets.coingecko.com/coins/images/6319/thumb/usdc.png?1696506694',
    },
    last_updated_at: '2024-03-27T09:17:33.297Z',
    market_cap: 32336468430,
    name: 'USDC',
    platforms: {
      polygon: {
        contract_address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        decimal_place: 6,
      },
    },
    symbol: 'usdc',
    version: '0b008a10',
  },
  {
    description: {
      en: "Shiba Inu (SHIB) is a meme token which began as a fun currency and has now transformed into a decentralized ecosystem. During the initial launch, 50% of the supply was allocated into Vitalik Buterin's ethereum wallet. \r\n\r\nAs a result of that, Vitalik proceeded to donate 10% of his SHIB holdings to a COVID-19 relief effort in India and the remaining 40% is burnt forever. That donation was worth about $1 billion at that time, which makes it one of the largest donation ever in the world.\r\n\r\nWhat is the Shiba Inu community working on right now? The Shiba Inu team launched a decentralized exchange called Shibaswap with 2 new tokens, LEASH and BONE. LEASH is a scarce supply token that is used to offer incentives on Shibaswap. BONE is the governance token for holders to vote on proposals on Doggy DAO.",
    },
    id: 'shiba-inu',
    image: {
      large:
        'https://assets.coingecko.com/coins/images/11939/large/shiba.png?1696511800',
      small:
        'https://assets.coingecko.com/coins/images/11939/small/shiba.png?1696511800',
      thumb:
        'https://assets.coingecko.com/coins/images/11939/thumb/shiba.png?1696511800',
    },
    is_custom_coin: true,
    last_updated_at: '2024-03-27T09:15:20.815Z',
    market_cap: 17550687612,
    name: 'Shiba Inu',
    platforms: {
      binance: {
        contract_address: '0x2859e4544c4bb03966803b044a93563bd2d0dd4d',
        decimal_place: 18,
      },
    },
    symbol: 'shib',
  },
];

export const testCase1: IValidTokenDiffTestCase = {
  name: 'With no params',
  params: {
    ...erc20TokenAutomationParams,
    tokenJsonList: existingTokenList,
  },
  result: existingTokenList,
  mocks: { coingeckoList: [] },
};
