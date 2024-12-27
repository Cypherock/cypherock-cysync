/* eslint-disable class-methods-use-this */
import * as operations from './operations';

export { updateLogger } from './utils/logger';

export * from './operations/types';

export class BuySellSupport {
  public getTradingPairs() {
    return operations.getTradingPairs();
  }

  public getEstimatedQuote(params: operations.IGetEstimatedQuoteParams) {
    return operations.getEstimatedQuote(params);
  }

  public getPaymentMethods(params: operations.IGetPaymentMethodsParams) {
    return operations.getPaymentMethods(params);
  }

  public preorder(params: operations.IPreorderParams) {
    return operations.preorder(params);
  }

  public getOrderDetails(params: operations.IGetOrderDetailsParams) {
    return operations.getOrderDetails(params);
  }
}
