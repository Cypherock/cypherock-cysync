import fs from 'fs';
import path from 'path';

import { sleep } from '@cypherock/cysync-utils';
import lodash from 'lodash';

import {
  CoingeckoCoinDetails,
  coingeckoPlatformReverseMapping,
  getCoingeckoCoinDetails,
} from './coingecko';
import { config } from './config';
import { Erc20ListItem, getERC20TokenDifference } from './diff';

const MAX_RETRIES = 3;
const SLEEP_TIME = 10000;
const BATCH_LEN = 20;

const COIN_DETAILS_PATH = path.join(config.DATA_FOLDER, 'coinDetails');

const fetchInBatch = async (ids: string[]): Promise<CoingeckoCoinDetails[]> => {
  let retries = 0;
  const results: CoingeckoCoinDetails[] = [];
  let idsToFetch = ids;

  do {
    const promises = idsToFetch.map(id => getCoingeckoCoinDetails(id));
    const promiseResult = await Promise.allSettled(promises);
    idsToFetch = [];

    for (let i = 0; i < promiseResult.length; i += 1) {
      const result = promiseResult[i];

      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.warn(result.reason);
        idsToFetch.push(ids[i]);
      }
    }

    if (idsToFetch.length > 0) {
      retries += 1;
      console.log(`Waiting between retries... ${retries}`);
      await sleep(SLEEP_TIME);
    } else {
      await sleep(50);
    }
  } while (idsToFetch.length > 0 && retries < MAX_RETRIES);

  return results;
};

const getAllCoinDetails = async (ids: string[]) => {
  const allCoinDetails: Record<string, CoingeckoCoinDetails | undefined> = {};

  const chunkArray = lodash.chunk(ids, BATCH_LEN);

  let totalFetched = 0;
  for (const chunk of chunkArray) {
    const details = await fetchInBatch(chunk);
    for (const detail of details) {
      await fs.promises.writeFile(
        path.join(COIN_DETAILS_PATH, `${detail.id}.json`),
        JSON.stringify(detail, undefined, 2),
      );
      allCoinDetails[detail.id] = detail;
    }

    totalFetched += chunk.length;
    console.log(totalFetched, ids.length - totalFetched);
  }

  return allCoinDetails;
};

const getExistingCoinDetails = async () => {
  if (!fs.existsSync(COIN_DETAILS_PATH)) {
    await fs.promises.mkdir(COIN_DETAILS_PATH, { recursive: true });
  }

  const files = await fs.promises.readdir(COIN_DETAILS_PATH);
  const map: Record<string, CoingeckoCoinDetails | undefined> = {};

  for (const file of files) {
    const filePath = path.join(COIN_DETAILS_PATH, file);
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    map[file.split('.')[0]] = JSON.parse(fileContent);
  }

  return map;
};

const sortByPlatform = (item: Erc20ListItem) => {
  const platforms = Object.keys(item.platforms ?? {}).join('');
  return `${item.id}${platforms}`;
};

const fixPropertyOrder = (list: Erc20ListItem[]) => {
  const fixedPropertyOrder: Erc20ListItem[] = [];

  for (const item of list) {
    const sortedPlatformKeys = Object.keys(item.platforms ?? {}).sort();
    const platforms: Record<
      string,
      { contract_address: string; decimal_place: number } | undefined
    > = {};

    for (const key of sortedPlatformKeys) {
      const obj = (item.platforms ?? {})[key];
      platforms[key] = obj
        ? {
            contract_address: obj.contract_address,
            decimal_place: obj.decimal_place,
          }
        : undefined;
    }

    fixedPropertyOrder.push({
      description: item.description ? { en: item.description.en } : undefined,
      id: item.id,
      image: item.image
        ? {
            large: item.image.large,
            small: item.image.small,
            thumb: item.image.thumb,
          }
        : undefined,
      is_custom_coin: item.is_custom_coin,
      is_zero_value_coin: item.is_zero_value_coin,
      last_updated_at: item.last_updated_at,
      market_cap: item.market_cap,
      name: item.name,
      platforms: item.platforms ? platforms : undefined,
      symbol: item.symbol,
      version: item.version,
    });
  }

  return fixedPropertyOrder;
};

export const createNewErc20List = async () => {
  const list = await getERC20TokenDifference();

  const uniqueIds = lodash.uniq(
    list.filter(e => !e.is_zero_value_coin).map(e => e.id),
  );

  const existingCoinDetails = await getExistingCoinDetails();

  const existingCoinDetailsIds = Object.keys(existingCoinDetails);

  const remaingIds = lodash.difference(uniqueIds, existingCoinDetailsIds);
  console.log({
    uniqueIds: uniqueIds.length,
    existingCoinDetailsIds: existingCoinDetailsIds.length,
    remaingIds: remaingIds.length,
  });

  const allCoinDetails: Record<string, CoingeckoCoinDetails | undefined> = {
    ...(existingCoinDetails as any),
    ...(await getAllCoinDetails(remaingIds)),
  };

  const newCoinList: Erc20ListItem[] = [];

  for (const coin of list) {
    const coinDetails = allCoinDetails[coin.id];

    if (coin.is_zero_value_coin) {
      newCoinList.push({ ...coin, market_cap: 0 });
    } else if (!coinDetails) {
      console.warn(`No coin details found for ${coin.id}`);
    } else if (coin.is_custom_coin) {
      newCoinList.push({
        ...coin,
        market_cap: coinDetails.market_data?.market_cap?.usd ?? 0,
        image: coinDetails.image,
        description: {
          en: coinDetails.description?.en?.replace(/[\u2028]/g, '\n'),
        },
        last_updated_at: coinDetails.last_updated,
      });
    } else {
      newCoinList.push({
        ...coin,
        platforms: Object.entries(coin.platforms ?? {}).reduce(
          (a, v) => ({
            ...a,
            [v[0]]: {
              ...v[1],
              decimal_place:
                coinDetails.detail_platforms?.[
                  coingeckoPlatformReverseMapping[v[0]] ?? ''
                ]?.decimal_place ?? 18,
            },
          }),
          {},
        ),
        market_cap: coinDetails.market_data?.market_cap?.usd ?? 0,
        image: coinDetails.image,
        description: {
          en: coinDetails.description?.en?.replace(/[\u2028]/g, '\n'),
        },
        last_updated_at: coinDetails.last_updated,
      });
    }
  }

  const sortedList = lodash.orderBy(
    newCoinList,
    ['market_cap', sortByPlatform],
    ['desc'],
  );

  // re-generate list to fix order of properties to generate deterministic JSON object
  // deterministic JSON object enables minimal diff when updating the list
  const fixedPropOrderList = fixPropertyOrder(sortedList);

  await fs.promises.writeFile(
    path.join(config.DATA_FOLDER, 'erc20.json'),
    JSON.stringify(fixedPropOrderList, undefined, 2),
  );
};
