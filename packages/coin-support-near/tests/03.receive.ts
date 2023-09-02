import { IAccount, IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Observer } from 'rxjs';

import * as nearAppMock from './__mocks__/nearApp';
import * as serviceMock from './__mocks__/services';

import { NearSupport, INearReceiveEvent } from '../src';

describe('03. Receive', () => {
  let support: NearSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getOneMock = jest.fn<() => Partial<IAccount>>().mockReturnValue({
    walletId: '00000000',
    assetId: 'near',
    xpubOrAddress:
      '03ac41f86e4b44155d81a339422480e1d2b6eee723c531a41599e4ea775dc449fa',
    derivationPath: `m/44'/397'/0'/0'/0'`,
  });

  beforeEach(() => {
    support = new NearSupport();
    connection = {} as any;
    db = {
      account: {
        getOne: getOneMock,
      },
    } as any;

    nearAppMock.create.mockClear();
    nearAppMock.getPublicKeys.mockClear();

    serviceMock.getBalance.mockClear();
    serviceMock.getTransactionCount.mockClear();

    getOneMock.mockClear();
  });

  test('should be able to verify receive address', done => {
    let isFlowCompleted = false;
    let generatedAddress = '';
    let didAddressMatched = false;

    const observer: Observer<INearReceiveEvent> = {
      next: data => {
        if (data.type === 'Address' && data.address) {
          generatedAddress = data.address;
        }

        if (data.type === 'AddressMatched' && data.didAddressMatched) {
          didAddressMatched = data.didAddressMatched;
        }

        if (data.type === 'Device' && data.device?.isDone) {
          isFlowCompleted = true;
        }
      },
      complete: () => {
        expect(isFlowCompleted).toEqual(true);

        expect(generatedAddress).toBeTruthy();

        expect(didAddressMatched).toBe(true);

        done();
      },
      error: err => {
        throw err;
      },
    };

    support
      .receive({
        connection,
        db,
        accountId: 'account1',
      })
      .subscribe(observer);
  });
});
