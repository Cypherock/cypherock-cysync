import { BuySellSupport2 } from '@cypherock/app-support-buy-sell-2';
import {
  createCSVFromObject,
  formatDateToUTCString,
} from '@cypherock/cysync-utils';
import { IBuySellOrder, IDatabase } from '@cypherock/db-interfaces';

import logger from './utils/logger';

export const createCSVFromOrder = (
  transactions: {
    date: string;
    provider: string;
    country: string;
    paymentMethod: string;
    assetFrom: string;
    assetFromAmount: string;
    assetTo: string;
    assetToAmount: string;
    status: string;
    wallet: string;
    account: string;
    id: string;
  }[],
) =>
  createCSVFromObject({
    headers: [
      { name: 'Date (UTC)', key: 'date' },
      { name: 'Provider', key: 'provider' },
      { name: 'Country', key: 'country' },
      { name: 'PaymentMethod', key: 'paymentMethod' },
      { name: 'Asset From', key: 'assetFrom' },
      { name: 'Amount From', key: 'assetFromAmount' },
      { name: 'Asset To', key: 'assetTo' },
      { name: 'Amount To', key: 'assetToAmount' },
      { name: 'Status', key: 'status' },
      { name: 'Wallet', key: 'wallet' },
      { name: 'Account', key: 'account' },
      { name: 'OrderId', key: 'id' },
    ],
    rows: transactions.map(t => ({
      ...t,
      date: formatDateToUTCString(t.date),
    })),
  });

export const insertBuySellOrder = async (
  db: IDatabase,
  order: Omit<IBuySellOrder, '__id'>,
) => {
  const existingOrder = await db.buySellOrder.getOne({
    __id: order.id,
  });

  if (existingOrder) {
    await db.buySellOrder.update(
      {
        __id: order.id,
      },
      {
        ...order,
      },
    );
  } else {
    await db.buySellOrder.insert({
      __id: order.id,
      ...order,
    });
  }
};

export const updateBuySellOrder = async (
  db: IDatabase,
  order: Omit<Partial<IBuySellOrder>, '__id'>,
) => {
  const existingOrder = await db.buySellOrder.getOne({
    __id: order.id,
  });

  if (existingOrder) {
    await db.buySellOrder.update(
      {
        __id: order.id,
      },
      {
        ...order,
      },
    );
  }
};

export interface ISyncOrdersEvent {
  isSuccessful: boolean;
}

const MAX_RETRIES = 3;

export const syncBuySellOrdersCore = async (params: {
  db: IDatabase;
}): Promise<ISyncOrdersEvent> => {
  const { db } = params;
  const buySell2 = new BuySellSupport2();

  const dbOrders = await db.buySellOrder.getAll();
  const orders = dbOrders.map(order => ({
    id: order.id,
    provider: order.provider,
  }));

  let isSuccessful = false;
  let retryCount = 0;
  let error: any;

  while (!isSuccessful && retryCount < MAX_RETRIES) {
    try {
      const ordersResponse = await buySell2.getOrders(orders);

      if (!ordersResponse.success || !ordersResponse.data) {
        throw new Error(ordersResponse.error);
      }

      const updatedOrders = ordersResponse.data;
      for (const updatedOrder of updatedOrders) {
        const order: Partial<IBuySellOrder> = {
          id: updatedOrder.id,
          status: updatedOrder.status,
          updatedAt: updatedOrder.updatedAt,
          createdAt: updatedOrder.createdAt,
          amountFrom: updatedOrder.fromAmount,
        };

        // eslint-disable-next-line no-null/no-null
        if (updatedOrder.toAmount !== null) {
          order.amountTo = updatedOrder.toAmount;
        }

        await updateBuySellOrder(db, order);
      }
      isSuccessful = true;
    } catch (e) {
      retryCount += 1;
      logger.warn(`Error in syncing orders, retryCount: ${retryCount}`);
      logger.warn(e);
      error = e;
    }
  }

  if (!isSuccessful && error) {
    logger.error(`Error in syncing orders. Max retries exceeded`);
    logger.error(error);
  }

  return { isSuccessful };
};
