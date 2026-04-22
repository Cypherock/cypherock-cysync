import config from '@/config';

const defaultLinks = {
  termsOfUse: 'https://www.cypherock.com/terms',
  privacyPolicy: 'https://www.cypherock.com/privacy',
  supportEmail: 'support@cypherock.com',
  supportMailto: 'mailto:support@cypherock.com',
  blogs: 'https://cypherock.com/blogs',
  social: {
    telegram: 'https://t.me/cypherock',
    github: 'https://github.com/Cypherock',
    wellfound: 'https://wellfound.com/company/cypherock-wallet',
    linkedin: 'https://sg.linkedin.com/company/cypherockwallet',
    x: 'https://x.com/CypherockWallet',
  },
  product: {
    cypherockCover: 'https://www.cypherock.com/cypherock-cover',
    cypherockX1: 'https://www.cypherock.com/product/cypherock-x1/',
  },
  static: {
    fallbackCryptoIcon:
      'https://static.cypherock.com/images/fallback-crypto-icon.png',
    erc20IconById: (id: string) =>
      `https://static.cypherock.com/images/erc20-by-id/${id}.png`,
  },
};

const odixLinks = {
  ...defaultLinks,
  supportEmail: 'wallet@odixpay.com',
  supportMailto: 'mailto:wallet@odixpay.com',
  termsOfUse: 'https://odixpay.com/terms-conditions',
  privacyPolicy: 'https://odixpay.com/privacy-policy',
  blogs: 'https://odixpay.com/blogs',
  social: {
    telegram: 'https://t.me/odix-pay',
    github: 'https://github.com/odix-pay',
    wellfound: 'https://wellfound.com/company/odix-pay',
    linkedin: 'https://sg.linkedin.com/company/odix-pay',
    x: 'https://x.com/odix-pay',
  },
};

export const Links = config.VENDOR === 'odix' ? odixLinks : defaultLinks;
