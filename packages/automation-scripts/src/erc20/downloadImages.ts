import fs from 'fs';
import path from 'path';

import { erc20JsonList } from '@cypherock/coins';
import { sleep } from '@cypherock/cysync-utils';
import axios from 'axios';
import lodash from 'lodash';

import { config } from './config';
import { Erc20ListItem } from './diff';

const MAX_RETRIES = 3;
const SLEEP_TIME = 10000;
const BATCH_LEN = 20;

const IMAGE_FOLDER_PATH = path.join(config.DATA_FOLDER, 'images');

const downloadFile = async (fileUrl: string, filePath: string) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<void>(async (resolve, reject) => {
    const localFilePath = path.resolve(filePath);
    if (!fileUrl.startsWith('http')) {
      resolve();
      return;
    }
    if (fs.existsSync(localFilePath)) {
      resolve();
      return;
    }

    try {
      const response = await axios({
        method: 'GET',
        url: fileUrl,
        responseType: 'stream',
      });

      const w = response.data.pipe(fs.createWriteStream(localFilePath));

      w.on('finish', () => {
        resolve();
      });
      w.on('error', (err: any) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });

const fetchInBatch = async (coins: Erc20ListItem[]) => {
  let retries = 0;
  let coinsToFetch = coins;

  do {
    const promises = coinsToFetch.map(coin =>
      downloadFile(
        coin.image?.large ?? '',
        path.join(IMAGE_FOLDER_PATH, `${coin.id}.png`),
      ),
    );

    const promiseResult = await Promise.allSettled(promises);
    coinsToFetch = [];

    for (let i = 0; i < promiseResult.length; i += 1) {
      const result = promiseResult[i];

      if (result.status === 'rejected') {
        console.warn(result.reason);
        coinsToFetch.push(coins[i]);
      }
    }

    if (coinsToFetch.length > 0) {
      retries += 1;
      console.log(`Waiting between retries... ${retries}`);
      await sleep(SLEEP_TIME);
    } else {
      await sleep(50);
    }
  } while (coinsToFetch.length > 0 && retries < MAX_RETRIES);
};

export const downloadErc20Images = async () => {
  if (!fs.existsSync(IMAGE_FOLDER_PATH)) {
    await fs.promises.mkdir(IMAGE_FOLDER_PATH, { recursive: true });
  }

  const coinMap: Record<string, Erc20ListItem> = {};

  for (const coin of erc20JsonList as Erc20ListItem[]) {
    if (!coin.is_zero_value_coin && coin.image?.large) {
      coinMap[coin.id] = coin;
    }
  }

  const allCoins = Object.values(coinMap);
  const chunkArray = lodash.chunk(allCoins, BATCH_LEN);

  let totalFetched = 0;
  for (const chunk of chunkArray) {
    await fetchInBatch(chunk);

    totalFetched += chunk.length;
    console.log(totalFetched, allCoins.length - totalFetched);
  }
};
