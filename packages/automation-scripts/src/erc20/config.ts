import path from 'path';

export const config = {
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
  COINGECKO_URL: ' https://pro-api.coingecko.com/api/v3/',
  DATA_FOLDER: path.join(__dirname, '..', '..', '..', '.data'),
};
