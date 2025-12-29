/* eslint-disable class-methods-use-this */
import * as operations from './operations';

export { updateLogger } from './utils/logger';

export * from './operations/types';

export class BuySellSupport2 {
  public getOffers(params: operations.IGetOffersParams) {
    return operations.getOffers(params);
  }

  public createOrder(params: operations.ICreateOrderParams) {
    return operations.createOrder(params);
  }

  public getOrders(params: operations.IGetOrdersParams) {
    return operations.getOrders(params);
  }
}
