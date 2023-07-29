import { IDatabase } from '@cypherock/db-interfaces';
import { IDeviceConnection } from '@cypherock/sdk-interfaces';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Observer } from 'rxjs';

import * as btcAppMock from './__mocks__/btcApp';
import * as serviceMock from './__mocks__/services';

import { BtcSupport, IBtcReceiveEvent } from '../src';

describe('03. Receive', () => {
  let support: BtcSupport;
  let connection: IDeviceConnection;
  let db: IDatabase;
  const getOneMock = jest.fn().mockReturnValue({
    walletId: '00000000',
    assetId: 'bitcoin',
    xpubOrAddress: 'xpub1234',
  });

  beforeEach(() => {
    support = new BtcSupport();
    connection = {} as any;
    db = {
      account: {
        getOne: getOneMock,
      },
    } as any;

    btcAppMock.create.mockClear();
    btcAppMock.getPublicKey.mockClear();

    serviceMock.getDerivedAddresses.mockClear();

    getOneMock.mockClear();
  });

  test('should be able to verify receive address', done => {
    let isFlowCompleted = false;
    let generatedAddress = '';
    let didAddressMatched = false;

    const observer: Observer<IBtcReceiveEvent> = {
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
