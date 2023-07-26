import {
  IDatabase,
  IPriceHistory,
  IPriceHistoryRepository,
} from '@cypherock/db-interfaces';

import { ITestClass } from './types';

class PriceHistoryData implements ITestClass<IPriceHistory> {
  name = 'PriceHistory';

  sortKey = 'currency';

  isSortDescending = false;

  repo: IPriceHistoryRepository;

  sorted: IPriceHistory[] = [
    {
      days: 7,
      history: [
        {
          timestamp: 34,
          price: '0.002',
        },
        {
          timestamp: 90,
          price: '0.001',
        },
      ],
      assetId: 'assetId2',
      currency: 'INR',
    },
    {
      days: 365,
      history: [
        {
          timestamp: 1000,
          price: '0',
        },
        {
          timestamp: 10000,
          price: '1',
        },
        {
          timestamp: 20000,
          price: '2',
        },
        {
          timestamp: 30000,
          price: '3',
        },
      ],
      assetId: 'assetId0',
      currency: 'INS',
    },
    {
      days: 1,
      history: [
        {
          timestamp: 0,
          price: 'test',
        },
      ],
      assetId: 'assetId',
      currency: 'USC',
    },
    {
      days: 30,
      history: [
        {
          timestamp: 34,
          price: '0.002',
        },
        {
          timestamp: 90,
          price: '0.001',
        },
        {
          timestamp: 1000,
          price: '0.002',
        },
        {
          timestamp: 10000,
          price: '0.001',
        },
        {
          timestamp: 20000,
          price: '0.002',
        },
        {
          timestamp: 30000,
          price: '0.001',
        },
      ],
      assetId: 'assetId3',
      currency: 'USD',
    },
  ];

  onlyRequired: IPriceHistory[] = [
    {
      days: 1,
      history: [{ timestamp: 0, price: 'test' }],
      assetId: 'assetId',
      currency: 'USC',
    },
    {
      days: 7,
      history: [
        { timestamp: 34, price: '0.002' },
        { timestamp: 90, price: '0.001' },
      ],
      assetId: 'assetId2',
      currency: 'INR',
    },
    {
      days: 30,
      history: [
        { timestamp: 34, price: '0.002' },
        { timestamp: 90, price: '0.001' },
        { timestamp: 1000, price: '0.002' },
        { timestamp: 10000, price: '0.001' },
        { timestamp: 20000, price: '0.002' },
        { timestamp: 30000, price: '0.001' },
      ],
      assetId: 'assetId3',
      currency: 'USD',
    },
    {
      days: 365,
      history: [
        { timestamp: 1000, price: '0' },
        { timestamp: 10000, price: '1' },
        { timestamp: 20000, price: '2' },
        { timestamp: 30000, price: '3' },
      ],
      assetId: 'assetId0',
      currency: 'INS',
    },
  ];

  partial: Partial<IPriceHistory>[] = [
    {
      assetId: 'assetId',
      currency: 'USD',
    },
    {
      days: 7,
      history: [
        { timestamp: 34, price: '0.002' },
        { timestamp: 90, price: '0.001' },
      ],
      currency: 'INR',
    },
    {
      history: [
        { timestamp: 34, price: '0.002' },
        { timestamp: 90, price: '0.001' },
        { timestamp: 1000, price: '0.002' },
        { timestamp: 10000, price: '0.001' },
        { timestamp: 20000, price: '0.002' },
        { timestamp: 30000, price: '0.001' },
      ],
      assetId: 'assetId3',
    },
    {
      days: 365,
      assetId: 'assetId0',
      currency: 'INR',
    },
  ];

  all = this.onlyRequired;

  invalid: IPriceHistory[] = [
    {
      days: 'days' as any,
      history: 34 as any,
      assetId: null as any,
      currency: undefined as any,
    },
    {
      days: 'days' as any,
      history: [
        { timestamp: 1000, price: '0' },
        { timestamp: 10000, price: '1' },
        { timestamp: 20000, price: '2' },
        { timestamp: 30000, price: '3' },
      ],
      assetId: 'assetId0',
      currency: 'INR',
    },
    {
      days: 365,
      history: 34 as any,
      assetId: 'assetId0',
      currency: 'INR',
    },
    {
      days: 365,
      history: [
        { timestamp: 1000, price: '0' },
        { timestamp: 10000, price: '1' },
        { timestamp: 20000, price: '2' },
        { timestamp: 30000, price: '3' },
      ],
      assetId: null as any,
      currency: 'INR',
    },
    {
      days: 365,
      history: [
        { timestamp: 1000, price: '0' },
        { timestamp: 10000, price: '1' },
        { timestamp: 20000, price: '2' },
        { timestamp: 30000, price: '3' },
      ],
      assetId: 'assetId0',
      currency: undefined as any,
    },
  ];

  setRepository(db: IDatabase) {
    this.repo = db.priceHistory;
  }
}
export const priceHistoryData = new PriceHistoryData();
